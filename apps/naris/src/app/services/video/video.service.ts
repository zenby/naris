import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { VideoModel } from '../../api/streams/stream.model';
import { StreamService } from '../../api/streams/stream.service';
import { WorkshopsService } from '../../api/workshops/workshops.service';
import { VideoIdAndSource } from './video.models';

@Injectable()
export class VideoService {
  constructor(private stramsService: StreamService, private workshopsService: WorkshopsService) {}

  getVideoIdAndSource(video: VideoModel): VideoIdAndSource {
    if (video.vimeo_id) return { id: video.vimeo_id, source: 'vimeo' };
    if (video.kinescope_id) return { id: video.kinescope_id, source: 'kinescope' };

    return { id: video.youtube_id, source: 'youtube' };
  }

  getLastStreams(count: number): Observable<VideoModel[]> {
    return new Observable<VideoModel[]>((subscriber: Subscriber<VideoModel[]>) => {
      this.stramsService.getStreams().subscribe((videos) => {
        subscriber.next(this.getLastVideos(this.getVideosInSubFolders(videos), count));
      });
    });
  }

  getLastWorkshops(count: number): Observable<VideoModel[]> {
    return new Observable<VideoModel[]>((subscriber: Subscriber<VideoModel[]>) => {
      this.workshopsService.getWorkshops().subscribe((videos) => {
        subscriber.next(this.getLastVideos(this.getVideosInSubFolders(videos), count));
      });
    });
  }

  private getLastVideos(videos: VideoModel[], count: number): VideoModel[] {
    return videos
      .sort((left, right) =>
        right.createdAt && left.createdAt ? new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime() : 0
      )
      .slice(0, count);
  }

  private getVideosInSubFolders(videos: VideoModel[] | VideoModel): VideoModel[] {
    return (Array.isArray(videos) ? videos : [videos]).reduce(
      (acc: VideoModel[], item: VideoModel) =>
        item?.children ? [...acc, ...this.getVideosInSubFolders(item.children)] : [...acc, item],
      []
    );
  }
}
