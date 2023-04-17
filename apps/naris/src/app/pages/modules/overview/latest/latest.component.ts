import { Component } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { VideoModel } from '../../../../api/streams/stream.model';

@Component({
  selector: 'soer-latest',
  templateUrl: './latest.component.html',
})
export class LatestComponent {
  public streams: VideoModel[] = [];
  public workshops: VideoModel[] = [];
  private data: Data;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.data = this.route.snapshot.data;

    const getLastVideos = (videos: VideoModel[], count: number): VideoModel[] => {
      return videos
        .reduce((acc: VideoModel[], item: VideoModel) => [...acc, ...(item.children || [])], [])
        .sort((left, right) => new Date(right.createdAt ?? '').getTime() - new Date(left.createdAt ?? '').getTime())
        .slice(0, count);
    };

    this.streams = getLastVideos(this.data['streams'], 5);
    this.workshops = getLastVideos(this.data['workshops'], 5);
  }

  showVideo(video: VideoModel): void {
    let videoId = video.youtube_id;
    let videoSource = 'youtube';
    if (video.vimeo_id) {
      videoId = video.vimeo_id;
      videoSource = 'vimeo';
    }

    if (video.kinescope_id) {
      videoId = video.kinescope_id;
      videoSource = 'kinescope';
    }

    if (videoId === undefined) {
      const queryParams = this.route.snapshot.queryParams;
      this.router.navigate(['novideo'], { relativeTo: this.route, queryParams });
      return;
    }
    this.router
      .navigate([videoSource, videoId], {
        relativeTo: this.route,
      })
      .catch(() =>
        console.error(`
        LatestComponent: в RouteModule необходимо указать маршрут для проигрывания видео
          children: [
            {
              path: ':videoSource/:videoId',
              component: ComposeVideoPlayerComponent,
              data: { header: {title: 'Смотрим стрим...'}}
            }
          ]
      `)
      );
  }
}
