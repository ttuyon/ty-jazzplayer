import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioControlService {
	private _volume$ = new BehaviorSubject<number>(100);
	public readonly volume$ = this._volume$.asObservable();

	private _loop$ = new BehaviorSubject<boolean>(false);
	public readonly loop$ = this._loop$.asObservable();

	private _playState$ = new BehaviorSubject<boolean>(false);
	public readonly playState$ = this._playState$.asObservable();

  constructor() { }

  changeVolume(volume: number) {
  	this._volume$.next(volume);
  }

  changePlayState(playing: boolean) {
  	this._playState$.next(playing);
  }

  toggleLoop() {
  	this._loop$.next(!this._loop$.getValue());
  }
}
