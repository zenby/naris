import { Component } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { VideoModel } from '../../../../api/streams/stream.model';

@Component({
  selector: 'soer-latest',
  templateUrl: './latest.component.html',
})
export class LatestComponent {
  public streams: VideoModel[] = [];
  public workshops: VideoModel[] = [];
  private data: Data;

  constructor(private route: ActivatedRoute) {
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
}
