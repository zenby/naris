import { Component, AfterViewInit, Input, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import Player from '@vimeo/player';
import { VideoPlayerService } from './video-player.service';

@Component({
  selector: 'soer-vimeo-player',
  template: '<div #vimeoPlayer [attr.data-vimeo-id]="videoId"></div>',
  styles: [
    `
      div {
        width: 100%;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VimeoPlayerComponent implements AfterViewInit {
  @Input() videoId = '';
  @ViewChild('vimeoPlayer', { static: false }) vimeo!: ElementRef;
  private player: Player | null = null;

  constructor(private videoPlayerService: VideoPlayerService) {}

  ngAfterViewInit(): void {
    this.player = new Player(this.vimeo.nativeElement, { autoplay: true, dnt: true });
    this.player.on('loaded', () => this.videoPlayerService.stopLoading());

    const VIMEO_STORAGE_KEY = `vimeo_video_${this.videoId}`;
    const seconds = this.videoPlayerService.getVideoProgress(VIMEO_STORAGE_KEY);
    if (seconds > 0) {
      this.player.setCurrentTime(seconds);
      this.player.setPlaybackRate(this.videoPlayerService.getVideoPlayerSpeed());
    }
    this.player.on('timeupdate', ({ seconds }) =>
      this.videoPlayerService.setVideoProgress(VIMEO_STORAGE_KEY, String(seconds))
    );
    this.player.on('playbackratechange', ({ playbackRate }) => {
      this.videoPlayerService.setVideoPlayerSpeed(playbackRate);
    });
  }
}
