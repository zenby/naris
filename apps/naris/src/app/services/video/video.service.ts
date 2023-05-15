import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, Subscriber } from 'rxjs';
import {
  PersonalActivityService,
  VideoIdModel,
  PersonalActivityRaw,
} from '../../api/progress/personal-activity.service';
import { VideoModel } from '../../api/streams/stream.model';
import { StreamService } from '../../api/streams/stream.service';
import { WorkshopsService } from '../../api/workshops/workshops.service';
import { VideoIdAndSource } from './video.models';

export interface WathcedVideo {
  id: string;
  title: string;
  date: string;
}

interface VideosById {
  [id: string]: VideoModel & { id: string };
}

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(
    private stramsService: StreamService,
    private workshopsService: WorkshopsService,
    private personalActivity: PersonalActivityService
  ) {}

  getVideoIdAndSource(video: VideoModel): VideoIdAndSource {
    if (video.vimeo_id) return { id: video.vimeo_id, source: 'vimeo' };
    if (video.kinescope_id) return { id: video.kinescope_id, source: 'kinescope' };

    return { id: video.youtube_id, source: 'youtube' };
  }

  getAllVideos(): Observable<VideoModel[]> {
    return combineLatest([this.stramsService.getStreams(), this.workshopsService.getWorkshops()]).pipe(
      map(([streams, workshops]) => {
        return [...this.getVideosInSubFolders(streams), ...this.getVideosInSubFolders(workshops)];
      })
    );
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

  getWathcedVideos(): Observable<Array<WathcedVideo>> {
    return combineLatest([this.getAllVideos(), this.personalActivity.activityRaw$]).pipe(
      map(([videos, activity]) => {
        const videoById = this.groupVideosById(videos);
        return this.findWatchedVideos(videoById, activity);
      })
    );
  }

  private groupVideosById(videos: VideoModel[]): VideosById {
    const result: VideosById = {};
    videos.forEach((video) => {
      const videoId = this.getVideoIdAndSource(video).id;
      if (videoId && !result[videoId]) {
        result[videoId] = {
          id: videoId,
          ...video,
        };
      }
    });

    return result;
  }

  private findWatchedVideos(videosById: VideosById, activity: PersonalActivityRaw[]): WathcedVideo[] {
    const result: Array<WathcedVideo> = [];
    activity.forEach((activity) => {
      if (activity?.watched?.videos?.length) {
        activity.watched.videos.forEach((videoIdModel: VideoIdModel) => {
          const id = videoIdModel.videoId;
          if (videosById[id]) {
            result.push({
              id: videosById[id].id,
              title: videosById[id].title,
              date: activity.createdAt,
            });
          }
        });
      }
    });

    return result;
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
