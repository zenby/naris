import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import Player from '@vimeo/player';
import { VideoPlayerService } from '../video-player.service';
import { VideoSource } from '../video-source.model';

@Component({
  selector: 'soer-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() videoId = '';
  @Input() videoSource: VideoSource = 'youtube';
  @ViewChild('vimeoPlayer', { static: false }) vimeo!: ElementRef;

  public isLoading$ = this.videoPlayerService.getIsLoading();
  private player: Player | null = null;

  constructor(private videoPlayerService: VideoPlayerService) {
    this.videoPlayerService.startLoading();
  }

  ngOnInit(): void {
    if (this.videoSource === 'youtube') {
      this.initializeYouTubePlayer();
    }
  }

  ngAfterViewInit(): void {
    if (this.videoSource === 'vimeo') {
      this.initializeVimeoPlayer();
    }

    if (this.videoSource === 'kinescope') {
      this.initializeKinescopePlayer();
    }
  }

  ngOnDestroy(): void {
    this.disposeKinescopePlayer();
  }

  initializeYouTubePlayer() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
    this.videoPlayerService.stopLoading();
  }

  private initializeVimeoPlayer() {
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

  private initializeKinescopePlayer() {
    this.downloadKinescopePlayerScript();

    (window as any).onKinescopeIframeAPIReady = (playerFactory: any) => {
      playerFactory
        .create('player', {
          url: `https://kinescope.io/${this.videoId}`,
          size: { width: '100%', height: '100%' },
          behaviour: { autoPlay: true },
        })
        .then((player: any) => {
          this.videoPlayerService.stopLoading();
          this.player = player;
          player.once(player.Events.Ready, this.setDefaultPlaybackRate.bind(this));
          player.on(player.Events.PlaybackRateChange, this.savePlaybackRate.bind(this));
        });
    };
  }

  private downloadKinescopePlayerScript() {
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://player.kinescope.io/v2.18.17/iframe.player.js';
    document.body.appendChild(scriptTag);
  }

  private setDefaultPlaybackRate() {
    const speed = this.videoPlayerService.getVideoPlayerSpeed();
    this.player?.setPlaybackRate(speed);
  }

  private savePlaybackRate(value: { data: { playbackRate: number } }) {
    const newSpeed = value.data.playbackRate;
    this.videoPlayerService.setVideoPlayerSpeed(newSpeed);
  }

  private disposeKinescopePlayer(): void {
    this.player?.destroy();
    const wnd = window as any;
    wnd.KinescopeIframeApiReadyHandlers = undefined;
    wnd.onKinescopeIframeAPIReady = undefined;

    this.removeKinescopePlayerScript();
  }

  private removeKinescopePlayerScript() {
    const script = document.querySelector("script[src='https://player.kinescope.io/v2.18.17/iframe.player.js']");
    script?.remove();
  }
}
