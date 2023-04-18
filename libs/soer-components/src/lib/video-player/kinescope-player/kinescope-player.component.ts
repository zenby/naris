import { Component, Input, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { VideoPlayerService } from '../video-player.service';
import { KinescopePlayer } from './kinescope-player.model';

const SCRIPT_URL = 'https://player.kinescope.io/latest/iframe.player.js';

type KinescopePatchedWindow = Window & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onKinescopeIframeAPIReady?: (arg: any) => void;
  KinescopeIframeApiReadyHandlers?: Array<() => void>;
};

@Component({
  selector: 'soer-kinescope-player',
  template: '<div id="player"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KinescopePlayerComponent implements AfterViewInit, OnDestroy {
  @Input() videoId = '';
  private player: KinescopePlayer | null = null;

  constructor(private videoPlayerService: VideoPlayerService) {}

  ngAfterViewInit(): void {
    /*
      we have to download player script each time when modal opens because
      it calls onKinescopeIframeAPIReady only when script is loaded
    */
    this.downloadPlayerScript();

    /*
      need to declare this function on window object as
      when player script is downloaded it will be called automatically see
      https://kinescope.notion.site/IFrame-Player-API-Embedding-1381e9d8952d4d19a5c3530a3d99445f
    */
    (window as KinescopePatchedWindow).onKinescopeIframeAPIReady = (playerFactory) => {
      playerFactory
        .create('player', {
          url: `https://kinescope.io/${this.videoId}`,
          size: { width: '100%', height: '100%' },
          behaviour: { autoPlay: true },
        })
        .then((player: KinescopePlayer) => {
          this.videoPlayerService.stopLoading();
          this.player = player;
          player.once(player.Events.Ready, this.setDefaultPlaybackRate.bind(this));
          player.on(player.Events.PlaybackRateChange, this.savePlaybackRate.bind(this));
        });
    };
  }

  ngOnDestroy(): void {
    this.player?.destroy();
    // clear kinescope player handlers, otherwise they will be called several times
    const wnd = window as KinescopePatchedWindow;
    wnd.onKinescopeIframeAPIReady = undefined;
    wnd.KinescopeIframeApiReadyHandlers = undefined;

    // remove player script tag from the markup, otherwise there will be several scripts there
    this.removePlayerScript();
  }

  private downloadPlayerScript(): void {
    const scriptTag = document.createElement('script');
    scriptTag.src = SCRIPT_URL;
    document.body.appendChild(scriptTag);
  }

  private setDefaultPlaybackRate(): void {
    const speed = this.videoPlayerService.getVideoPlayerSpeed();
    this.player?.setPlaybackRate(speed);
  }

  private savePlaybackRate(value: { data: { playbackRate: number } }): void {
    const newSpeed = value.data.playbackRate;
    this.videoPlayerService.setVideoPlayerSpeed(newSpeed);
  }

  private removePlayerScript(): void {
    const script = document.querySelector(`script[src='${SCRIPT_URL}']`);
    script?.remove();
  }
}
