import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'soer-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: [],
})
export class AudioPlayerComponent {
  @Input() audioUrl = '';
  @Input() speed = 1;
  @Output() changeSpeed: EventEmitter<number> = new EventEmitter();

  changePlaybackSpeed(event: Event) {
    const audioPlayer = event.target as HTMLAudioElement;
    this.changeSpeed.emit(audioPlayer.playbackRate);
  }
}
