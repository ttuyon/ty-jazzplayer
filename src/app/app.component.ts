import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ChannelService, Track, Channel } from './channel.service';

import { LpComponent } from './lp/lp.component';
import { VerticalSliderComponent } from './vertical-slider/vertical-slider.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('audio') audioElement: ElementRef;
  @ViewChild(LpComponent) lpElement: LpComponent;
  @ViewChild(VerticalSliderComponent) verticalSliderComponent: VerticalSliderComponent;
  
  public channelList: Array<Channel> = [];
  public currentTrack: Track;

  public repeatOneTrack: boolean = false;
  public volumeSliderVisible: boolean = false;
  public muted: boolean = false;
  public volumeBeforeMute: number;
  
  constructor(
    private channelService: ChannelService
  ) { }

  ngOnInit() {
    this.channelService.getChannelList().subscribe((result) => {
      this.channelList = result;
    });
  }

  channelChanged(channelId) {
    if (channelId == -1) return;
    
    this.channelService.changeChannel(channelId);

    this.channelService.getNextTrack()
      .subscribe((track: Track) => {
        this.currentTrack = track;
      });
  }

  audioStarted() {
    this.lpElement.playing = true;
  }

  audioEnded() {
    this.lpElement.playing = false;

    if (this.repeatOneTrack) return;

    this.channelService.getNextTrack()
      .subscribe((track: Track) => {
        this.currentTrack = track;
      });
  }

  audioPaused() {
    this.lpElement.playing = false;
  }

  lpClicked() {
    if (!this.currentTrack) return;

    if (this.lpElement.playing) {
      this.audioElement.nativeElement.pause();
    } else {
      this.audioElement.nativeElement.play();
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
    this.muted = volume == 0;
  }

  toggleAudioLoop() {
    this.repeatOneTrack = !this.repeatOneTrack;

    if (this.repeatOneTrack) {
      this.audioElement.nativeElement.setAttribute('loop', '');
    } else {
      this.audioElement.nativeElement.removeAttribute('loop');
    }
  }

}
