import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ChannelService, Track, Channel } from './channel.service';

import { LpComponent } from './lp/lp.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('audio') audioElement: ElementRef;
  @ViewChild('lp', {read: LpComponent}) lpElement: LpComponent;
  
  public channelList: Array<Channel> = [];
  public currentTrack: Track;
  
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

    this.channelService.getNextTrack()
      .subscribe((track: Track) => {
        this.currentTrack = track;
      });
  }

  audioPaused() {
    this.lpElement.playing = false;
  }

  lpClicked() {
    if (this.lpElement.playing) {
      this.audioElement.nativeElement.pause();
    } else {
      this.audioElement.nativeElement.play();
    }
  }

}
