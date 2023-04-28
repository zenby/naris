import { ChangeDetectorRef, Component } from '@angular/core';
import { VideoService, WathcedVideo, WathcedVideosByDate } from '../../../../services/video/video.service';

@Component({
  selector: 'soer-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  public wathcedVideosByDate: WathcedVideosByDate = {};

  constructor(private videoService: VideoService, private cdr: ChangeDetectorRef) {
    this.videoService.getWathcedVideosByDate().subscribe((value) => {
      this.wathcedVideosByDate = value;
      this.cdr.markForCheck();
    });
  }

  getDateHeader(date: string): string {
    return new Date(date).getDate().toString();
  }

  getDateClass(date: string): string {
    return this.isHasWatchedVideos(this.dateParse(date)) ? 'day-with-activity' : 'day-without-activity';
  }

  getWatchedVideos(date: string): WathcedVideo[] {
    return this.wathcedVideosByDate[this.getDateString(this.dateParse(date))] ?? [];
  }

  private isHasWatchedVideos(date: Date): boolean {
    return this.wathcedVideosByDate[this.getDateString(date)]?.length > 0;
  }

  private dateParse(dateString: string): Date {
    return this.videoService.dateParse(dateString);
  }

  private getDateString(date: Date): string {
    return this.videoService.getDateString(date);
  }
}
