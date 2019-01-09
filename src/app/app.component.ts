import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, HostBinding } from '@angular/core';
import { fromEvent as ObservableFromEvent, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { ChannelService } from './channel.service';
import { AudioControlService } from './audio-control.service';
import { PlaylistService } from './playlist.service';
import { Track } from './track.model';
import { Channel } from './channel.model';

import { LpComponent } from './lp/lp.component';
import { VerticalSliderComponent } from './vertical-slider/vertical-slider.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('audio') audioElement: ElementRef<HTMLAudioElement>;
  @ViewChild('channelSelect') channelSelectElement: ElementRef<HTMLSelectElement>;

  @ViewChild(LpComponent) lpElement: LpComponent;
  @ViewChild(VerticalSliderComponent) verticalSliderComponent: VerticalSliderComponent;

  @HostBinding('class.history-view') sidebarOpened: boolean;

  private unsubscribe: Subject<void> = new Subject<void>();

  public channelList: Array<Channel> = [];
  public currentTrack: Track;

  public repeatOneTrack: boolean = false;

  private _trackLoading: boolean = false;
  public trackLoading: boolean = false;

  public isPlaylist: boolean = false;

  public sidebarMode = 'history';

  constructor(
    private channelService: ChannelService,
    private audioControlService: AudioControlService,
    private palylistService: PlaylistService
  ) { }

  ngOnInit() {
    this.channelService.getChannelList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result) => {
        this.channelList = result;
      });

    this.channelService.currentChannel$
      .pipe(
        takeUntil(this.unsubscribe),
        filter((channel) => {
          return channel &&
            this.channelSelectElement &&
            channel.id !== parseInt(this.channelSelectElement.nativeElement.value)
        })
      )
      .subscribe((channel) => {
        this.channelSelectElement.nativeElement.value = channel.id.toString();
      });

    this.channelService.currentTrack$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((track: Track) => {
        this._trackLoading = false;
        this.trackLoading = false;
        this.currentTrack = track;

        if (track) {
          document.title = `${track.title} by ${track.artist}`;
          this.isPlaylist = this.palylistService.hasTrack(track.id);
        } else {
          this.isPlaylist = false;
        }
      });

    this.audioControlService.playState$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((playing) => {
        this.lpElement.playing = playing;
      });
  }

  ngAfterViewInit() {
    ['play', 'pause', 'ended', 'error'].forEach((eventType) => {
      ObservableFromEvent(this.audioElement.nativeElement, eventType)
        .subscribe((event) => this.audioPlayStateChanged(eventType, event));
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  channelChanged(channelId) {
    channelId = parseInt(channelId);

    if (channelId === -1) return;

    this.channelService.changeChannel(channelId);
    this.requestNextTrack();
  }

  audioPlayStateChanged(type: string, event) {
    this.audioControlService.changePlayState(type === 'play');

    switch (type) {
      case 'ended':
        if (this.repeatOneTrack) return;
        this.requestNextTrack();
        break;
      case 'error':
        if (this.currentTrack) {
          console.log('an error occured, change track');
          this.requestNextTrack();
        }
        break;
      default:
        break;
    }
  }

  lpClicked() {
    if (!this.currentTrack) return;

    if (this.audioElement.nativeElement.paused) {
      this.audioElement.nativeElement.play();
    } else {
      this.audioElement.nativeElement.pause();
    }
  }

  toggleAudioLoop() {
    this.repeatOneTrack = !this.repeatOneTrack;

    if (this.repeatOneTrack) {
      this.audioElement.nativeElement.setAttribute('loop', '');
    } else {
      this.audioElement.nativeElement.removeAttribute('loop');
    }
  }

  requestNextTrack() {
    this._trackLoading = true;

    setTimeout(() => {
      if (this._trackLoading) {
        this.trackLoading = true;
      }
    }, 500);

    this.channelService.requestNextTrack();
  }

  skipTrack() {
    if (!this.currentTrack || this._trackLoading) return;

    this.requestNextTrack();
  }

  openSidebar(mode: string) {
    this.sidebarMode = mode;
    this.sidebarOpened = true;
  }

  togglePlaylist() {
    if (!this.currentTrack) return;

    if (this.isPlaylist) {
      this.palylistService.removeTrack(this.currentTrack.id);
    } else {
      this.palylistService.addTrack(this.currentTrack);
    }

    this.isPlaylist = !this.isPlaylist;
  }

}
