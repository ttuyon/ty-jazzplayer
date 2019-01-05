import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, HostBinding } from '@angular/core';
import { fromEvent as ObservableFromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ChannelService, Track, Channel } from './channel.service';
import { AudioControlService } from './audio-control.service';

import { LpComponent } from './lp/lp.component';
import { VerticalSliderComponent } from './vertical-slider/vertical-slider.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('audio') audioElement: ElementRef;
  @ViewChild(LpComponent) lpElement: LpComponent;
  @ViewChild(VerticalSliderComponent) verticalSliderComponent: VerticalSliderComponent;

  @HostBinding('class.history-view') historyView: boolean;

  private unsubscribe: Subject<void> = new Subject<void>();

  public channelList: Array<Channel> = [];
  public currentTrack: Track;

  public repeatOneTrack: boolean = false;
  public volumeSliderVisible: boolean = false;
  public muted: boolean = false;
  public volumeBeforeMute: number;

  private _trackLoading: boolean = false;
  public trackLoading: boolean = false;

  constructor(
    private channelService: ChannelService,
    private audioControlService: AudioControlService
  ) { }

  ngOnInit() {
    this.channelService.getChannelList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result) => {
        this.channelList = result;
      });

    this.channelService.currentTrack$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((track: Track) => {
        this._trackLoading = false;
        this.trackLoading = false;
        this.currentTrack = track;
        if (track) {
          document.title = `${track.title} by ${track.artist}`;
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

  sliderChanged(value) {
    this.changeVolume(value);
  }

  toggleMute() {
    if (!this.muted) {
      this.volumeBeforeMute = this.audioElement.nativeElement.volume;
    }
    this.verticalSliderComponent.setSliderValue(this.muted ? this.volumeBeforeMute : 0);
  }

  changeVolume(volume) {
    this.audioElement.nativeElement.volume = volume;
    this.muted = volume === 0;
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
    if (!this.currentTrack) return;

    this.requestNextTrack();
  }

}
