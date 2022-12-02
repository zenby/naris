import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { VideoPlayerService } from './video-player.service';

@Component({
  selector: 'soer-youtube-player',
  template: '<youtube-player [videoId]="videoId"></youtube-player>',
  styles: [
    `
      youtube-player {
        width: 100%;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubePlayerComponent implements OnInit {
  @Input() videoId = '';

  constructor(private videoPlayerService: VideoPlayerService) {}

  ngOnInit(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.onload = () => this.videoPlayerService.stopLoading();

    document.body.appendChild(tag);
  }
}
