import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { VideoService } from '../../../../services/video/video.service';

export interface Activity {
  date: string;
  title: string;
}
@Component({
  selector: 'soer-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarPageComponent {
  public activities$: BehaviorSubject<Activity[]>;

  constructor(private videoService: VideoService) {
    this.activities$ = new BehaviorSubject([] as Activity[]);
    this.videoService
      .getWatchedVideos()
      .pipe(
        map((videos) => {
          return videos.map((video) => ({
            title: `Просмотрено видео ${video.title}`,
            date: video.date,
          }));
        })
      )
      .subscribe(this.activities$);
  }
}
