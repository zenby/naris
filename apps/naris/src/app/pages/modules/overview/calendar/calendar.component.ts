import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VideoService, WathcedVideo, WathcedVideosByDate } from '../../../../services/video/video.service';

export interface DateActivity {
  [date: string]: WathcedVideo[];
}
@Component({
  selector: 'soer-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  public wathcedVideosByDate: WathcedVideosByDate = {};
  public dateActivity$: BehaviorSubject<DateActivity>;

  constructor(private videoService: VideoService, private cdr: ChangeDetectorRef) {
    this.videoService.getWathcedVideosByDate().subscribe((value) => {
      this.wathcedVideosByDate = value;
      this.cdr.markForCheck();
    });

    this.dateActivity$ = new BehaviorSubject({});
    this.videoService.getWathcedVideosByDate().subscribe(this.dateActivity$);
  }

  getDateClass(date: string): string {
    if (new Date(date) > new Date()) {
      return 'day-in-future';
    }
    return this.isHasWatchedVideos(date) ? 'day-with-activity' : 'day-without-activity';
  }

  getWatchedVideos(date: string): WathcedVideo[] {
    return this.wathcedVideosByDate[this.getDateKey(date)] ?? [];
  }

  private isHasWatchedVideos(date: string | Date): boolean {
    return this.wathcedVideosByDate[this.getDateKey(date)]?.length > 0;
  }

  private getDateKey(date: string | Date): string {
    return this.videoService.getDateKey(date);
  }
}
