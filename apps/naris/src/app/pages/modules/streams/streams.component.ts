import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { VideoModel } from '../../../api/streams/stream.model';
import { VideoService } from '../../../services/video/video.service';

@Component({
  selector: 'soer-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.scss'],
})
export class StreamsComponent implements OnInit, OnDestroy {
  public streams: VideoModel[] = [];
  private queryParamsSub: Subscription | null = null;
  constructor(private route: ActivatedRoute, private router: Router, private videoService: VideoService) {}

  ngOnInit(): void {
    this.queryParamsSub = this.route.queryParams.subscribe(() => {
      this.streams = this.route.snapshot.data?.['streams'] || [];
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamsSub) {
      this.queryParamsSub.unsubscribe();
    }
  }

  showVideo(video: VideoModel): void {
    const { id: videoId, source: videoSource } = this.videoService.getVideoIdAndSource(video);

    if (videoId === undefined) {
      const queryParams = this.route.snapshot.queryParams;
      this.router.navigate(['novideo'], { relativeTo: this.route, queryParams });
      return;
    }
    this.router.navigate([videoSource, videoId], {
      relativeTo: this.route,
    });
  }
}
