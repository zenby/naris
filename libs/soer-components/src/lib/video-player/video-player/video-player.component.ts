import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { VideoPlayerService } from '../video-player.service';
import { VideoSource } from '../video-source.model';

@Component({
  selector: 'soer-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent {
  @Input() videoId = '';
  @Input() videoSource: VideoSource = 'youtube';

  public isLoading$ = this.videoPlayerService.getIsLoading();

  constructor(private videoPlayerService: VideoPlayerService) {
    this.videoPlayerService.startLoading();
  }
}
