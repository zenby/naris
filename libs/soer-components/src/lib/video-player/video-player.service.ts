import { Injectable } from '@angular/core';
import { LocalStorageService } from '@soer/sr-local-storage';
import { BehaviorSubject, Observable } from 'rxjs';

const VIDEO_PLAYER_SPEED_KEY = 'videoPlayerSpeed';

@Injectable()
export class VideoPlayerService {
  private defaultVideoPlayerSpeed = 1;
  private isLoading$ = new BehaviorSubject<boolean>(true);

  constructor(private storageService: LocalStorageService) {}

  getVideoPlayerSpeed(): number {
    const speed = this.storageService.getValue(VIDEO_PLAYER_SPEED_KEY);
    return speed ? parseFloat(speed) : this.defaultVideoPlayerSpeed;
  }

  setVideoPlayerSpeed(value: number): void {
    this.storageService.setValue(VIDEO_PLAYER_SPEED_KEY, String(value));
  }

  setVideoProgress(key: string, time: string) {
    this.storageService.setValue(key, time);
  }

  getVideoProgress(key: string): number {
    return parseInt(this.storageService.getValue(key) || '0');
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  stopLoading(): void {
    this.isLoading$.next(false);
  }

  startLoading(): void {
    this.isLoading$.next(true);
  }
}
