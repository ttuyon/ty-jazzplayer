var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of as ObservableOf } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
var ChannelService = /** @class */ (function () {
    function ChannelService(http) {
        this.http = http;
        this.currentChannelId = -1;
        this.channelTracks = [];
        this.nowPlayingIndex = 0;
    }
    ChannelService.prototype.getChannelList = function () {
        // return this.http.get<any>('https://www.jazzradio.com/_papi/v1/jazzradio/currently_playing')
        // 	.pipe(
        // 		map((response) => {
        // 			return response.map((ch) => {
        //          return {
        //            id: ch.channel_id, 
        //            name: ch.channel_key
        //          };
        //        });
        // 		})
        // 	);
        return this.http.get('__ng_jsonp__.__req0.finished')
            // return this.http.jsonp<any>('https://www.jazzradio.com/_papi/v1/jazzradio/currently_playing', 'callback')
            .pipe(map(function (response) {
            return response.map(function (ch) {
                return {
                    id: ch.channel_id,
                    name: ch.channel_key
                };
            });
        }));
    };
    ChannelService.prototype.getChannel = function (channelId) {
        var _this = this;
        return this.http.get("https://www.jazzradio.com/_papi/v1/jazzradio/routines/channel/" + channelId + "?audio_token=c5a7dbacecf6aea002ff379da68061ae&_=%201501752135802")
            .pipe(filter(function (response) { return response.channel_id == _this.currentChannelId; }), map(function (response) {
            return response.tracks.map(function (t) {
                return {
                    id: t.id,
                    title: t.display_title,
                    artist: t.display_artist,
                    albumArtUrl: t.asset_url,
                    musicUrl: t.content.assets[0].url
                };
            });
        }), tap(function (tracks) {
            _this.channelTracks = _this.channelTracks.concat(tracks);
        }));
    };
    ChannelService.prototype.changeChannel = function (channelId) {
        if (channelId == this.currentChannelId)
            return;
        this.nowPlayingIndex = -1;
        this.currentChannelId = channelId;
        this.channelTracks = [];
    };
    ChannelService.prototype.getNextTrack = function () {
        var _this = this;
        if (this.nowPlayingIndex == -1 || this.nowPlayingIndex == this.channelTracks.length - 1) {
            if (this.nowPlayingIndex == -1)
                this.nowPlayingIndex = 0;
            else
                this.nowPlayingIndex++;
            return this.getChannel(this.currentChannelId)
                .pipe(map(function () {
                return _this.channelTracks[_this.nowPlayingIndex];
            }));
        }
        if (this.nowPlayingIndex == this.channelTracks.length - 2) {
            this.getChannel(this.currentChannelId).subscribe();
        }
        return ObservableOf(this.channelTracks[++this.nowPlayingIndex]);
    };
    ChannelService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], ChannelService);
    return ChannelService;
}());
export { ChannelService };
//# sourceMappingURL=channel.service.js.map