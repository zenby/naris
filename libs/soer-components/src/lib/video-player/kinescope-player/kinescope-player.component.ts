import { Component, Input, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { VideoPlayerService } from '../video-player.service';
import { KinescopePlayer } from './kinescope-player.model';

const SCRIPT_URL = 'https://player.kinescope.io/v2.18.17/iframe.player.js';

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
    this.downloadPlayerScript();

    (window as any).onKinescopeIframeAPIReady = (playerFactory: any) => {
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
    const wnd = window as any;
    wnd.onKinescopeIframeAPIReady = undefined;
    wnd.KinescopeIframeApiReadyHandlers = undefined;

    this.removePlayerScript();
  }

  private downloadPlayerScript() {
    const scriptTag = document.createElement('script');
    scriptTag.src = SCRIPT_URL;
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

  private removePlayerScript() {
    const script = document.querySelector(`script[src='${SCRIPT_URL}']`);
    script?.remove();
  }
}
