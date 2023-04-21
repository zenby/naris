import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../../../../services/video/video.service';
import { VideoModel } from '../../../../api/streams/stream.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'soer-latest',
  templateUrl: './latest.component.html',
})
export class LatestComponent {
  public streams: Observable<VideoModel[]>;
  public workshops: Observable<VideoModel[]>;

  constructor(private route: ActivatedRoute, private router: Router, private videoService: VideoService) {
    this.streams = this.videoService.getLastStreams(5);
    this.workshops = this.videoService.getLastWorkshops(5);
  }

  showVideo(video: VideoModel): void {
    const { id: videoId, source: videoSource } = this.videoService.getVideoIdAndSource(video);

    if (videoId === undefined) {
      const queryParams = this.route.snapshot.queryParams;
      this.router.navigate(['novideo'], { relativeTo: this.route, queryParams });
      return;
    }
    this.router.navigate([videoSource, videoId], { relativeTo: this.route });
  }
}
