import { Injectable } from '@angular/core';
import { LocalStorageService } from '@soer/sr-local-storage';

const AUDIO_PLAYER_SPEED_KEY = 'audioPlayerSpeed';

@Injectable()
export class QuestionsConfigService {
  private defaultAudioPlayerSpeed = 1;

  constructor(private storageService: LocalStorageService) {}

  getAudioPlayerSpeed(): number {
    const audioSpeed = this.storageService.getValue(AUDIO_PLAYER_SPEED_KEY);

    return audioSpeed ? parseFloat(audioSpeed) : this.defaultAudioPlayerSpeed;
  }

  setAudioPlayerSpeed(value: number): void {
    this.storageService.setValue(AUDIO_PLAYER_SPEED_KEY, String(value));
  }
}
