import { Injectable } from '@angular/core';
import { VideoService } from '../../../../services/video/video.service';
import { Observable, map } from 'rxjs';
import { WathcedVideo } from '../../../../services/video/video.service';
import { CalendarPageHelper } from './calendar-page.helper';
import { ActivityEventModel } from '@soer/soer-components';

@Injectable()
export class CalendarDataService {
  constructor(private videoService: VideoService) {}

  public getActivities$(): Observable<ActivityEventModel[]> {
    return this.videoService
      .getWathcedVideos()
      .pipe(map((videos: WathcedVideo[]) => CalendarPageHelper.mapWatchedVideosToActivities(videos)));
  }
}
