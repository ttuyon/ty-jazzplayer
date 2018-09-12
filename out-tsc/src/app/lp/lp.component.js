var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
var LpComponent = /** @class */ (function () {
    function LpComponent() {
        this.toggled = new EventEmitter();
    }
    LpComponent.prototype.ngOnInit = function () {
    };
    LpComponent.prototype.togglePlay = function () {
        this.playing = !this.playing;
        this.toggled.emit(this.playing);
    };
    __decorate([
        Input('albumCover'),
        __metadata("design:type", String)
    ], LpComponent.prototype, "albumCover", void 0);
    __decorate([
        Output('toggled'),
        __metadata("design:type", Object)
    ], LpComponent.prototype, "toggled", void 0);
    LpComponent = __decorate([
        Component({
            selector: 'app-lp',
            templateUrl: './lp.component.html',
            styleUrls: ['./lp.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], LpComponent);
    return LpComponent;
}());
export { LpComponent };
//# sourceMappingURL=lp.component.js.map