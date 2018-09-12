var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ChannelService } from './channel.service';
var AppComponent = /** @class */ (function () {
    function AppComponent(channelService) {
        this.channelService = channelService;
        this.albumCover = 'http://trunkfunk.com/yaki-da/wp-content/uploads/Ian-Pooley-Chord-Memory-Remixes-Force-Inc.-Music-Works.jpg';
        this.channelList = [];
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.channelService.getChannelList().subscribe(function (result) {
            _this.channelList = result;
        });
        // this.channelService.getChannel().subscribe((response) => {
        // 	console.warn(response);
        // });
    };
    AppComponent = __decorate([
        Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss']
        }),
        __metadata("design:paramtypes", [ChannelService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map