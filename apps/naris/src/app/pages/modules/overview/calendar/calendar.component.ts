import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../../../../services/video/video.service';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'soer-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  public wathcedVideosByDate: { [date: string]: { id: string; title: string }[] } = {};

  constructor(private route: ActivatedRoute, private router: Router, private videoService: VideoService) {
    Array.from(new Array(30))
      .fill(1)
      .map((item, index: number) => {
        this.wathcedVideosByDate[`2023-04-${index + 1}`] = Array.from(new Array(Math.floor(Math.random() * 3)))
          .fill(1)
          .map(() => ({
            id: faker.random.numeric(6),
            title: faker.random.words(3),
          }));
      });
  }

  getDateHeader(date: string): string {
    return new Date(date).getDate().toString();
  }

  getDateClass(date: string): string {
    return this.isHasWatchedVideos(new Date(date)) ? 'day-with-activity' : 'day-without-activity';
  }

  getWatchedVideos(date: string): Array<{ id: string; title: string }> {
    return this.wathcedVideosByDate[new Date(date).toISOString().slice(0, 10)] ?? [];
  }

  private isHasWatchedVideos(date: Date): boolean {
    return this.wathcedVideosByDate[date.toISOString().slice(0, 10)]?.length > 0;
  }
}
