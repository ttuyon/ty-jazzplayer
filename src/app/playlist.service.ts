import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { Track } from './track.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private _playlist$ = new BehaviorSubject<Track[]>([]);
  public readonly playlist$ = this._playlist$.asObservable();

  constructor() {
    this.restorePlaylist();
    this.playlist$.subscribe((playlist) => {
      this.savePlaylist();
    });
  }

  addTrack(track: Track) {
    if (this.hasTrack(track.id)) return;

    const playlist = this._playlist$.getValue();
    playlist.push(track);
    this._playlist$.next(playlist);
  }

  removeTrack(trackId: number) {
    const playlist = this._playlist$.getValue();
    const index = playlist.findIndex((pTrack) => pTrack.id === trackId);

    if (index === -1) return;

    playlist.splice(index, 1);
    this._playlist$.next(playlist);
  }

  hasTrack(trackId: number): boolean {
    return !!this._playlist$.getValue().find((pTrack) => pTrack.id === trackId);
  }

  getPlaylist(): Track[] {
    return this._playlist$.getValue();
  }

  savePlaylist() {
    localStorage.setItem('playlist', JSON.stringify(this._playlist$.getValue()));
  }

  restorePlaylist() {
    const savedPlaylist = localStorage.getItem('playlist');
    this._playlist$.next(savedPlaylist ? JSON.parse(savedPlaylist) : []);
  }
}
