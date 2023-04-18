import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoSource } from '@soer/soer-components';
import { VideoModel } from '../../../../api/streams/stream.model';

@Component({
  selector: 'soer-latest',
  templateUrl: './latest.component.html',
})
export class LatestComponent implements OnInit {
  public streams: VideoModel[] = [];
  public workshops: VideoModel[] = [];
  private data: { streams: VideoModel[]; workshops: VideoModel[] } = {
    streams: [],
    workshops: [],
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.data = this.route.snapshot.data as { streams: VideoModel[]; workshops: VideoModel[] };
    this.streams = this.getLastVideos(this.getVideosInSubFolders(this.data.streams), 5);
    this.workshops = this.getLastVideos(this.getVideosInSubFolders(this.data.workshops), 5);
  }

  private getLastVideos(videos: VideoModel[], count: number): VideoModel[] {
    return videos
      .sort((left, right) =>
        right.createdAt && left.createdAt ? new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime() : 0
      )
      .slice(0, count);
  }

  private getVideosInSubFolders(videos: VideoModel[]): VideoModel[] {
    return videos.reduce(
      (acc: VideoModel[], item: VideoModel) =>
        item?.children ? [...acc, ...this.getVideosInSubFolders(item.children)] : [...acc, item],
      []
    );
  }

  showVideo(video: VideoModel): void {
    const { id: videoId, source: videoSource } = this.getVideoIdAndSource(video);

    if (videoId === undefined) {
      const queryParams = this.route.snapshot.queryParams;
      this.router.navigate(['novideo'], { relativeTo: this.route, queryParams });
      return;
    }
    this.router.navigate([videoSource, videoId], { relativeTo: this.route });
  }

  private getVideoIdAndSource(video: VideoModel): { id?: string; source: VideoSource } {
    if (video.vimeo_id) {
      return { id: video.vimeo_id, source: 'vimeo' };
    }

    if (video.kinescope_id) {
      return { id: video.kinescope_id, source: 'kinescope' };
    }
    return { id: video.youtube_id, source: 'youtube' };
  }
}
