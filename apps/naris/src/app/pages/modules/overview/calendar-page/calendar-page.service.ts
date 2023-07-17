import { Injectable } from '@angular/core';
import { VideoService } from '../../../../services/video/video.service';
import { Observable, map } from 'rxjs';
import { CalendarPageHelper } from './calendar-page.helper';
import { ActivityEventModel } from '@soer/soer-components';
import { WatchedVideo } from '../../../../services/video/video.models';

@Injectable()
export class CalendarDataService {
  constructor(private videoService: VideoService) {}

  public getActivities$(): Observable<ActivityEventModel[]> {
    return this.videoService
      .getWatchedVideos()
      .pipe(map((videos: WatchedVideo[]) => CalendarPageHelper.mapWatchedVideosToActivities(videos)));
  }
}
