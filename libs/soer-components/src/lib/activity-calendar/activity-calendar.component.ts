import { formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface DayEvent {
  title: string;
  date: string;
}

@Component({
  selector: 'soer-activity-calendar',
  templateUrl: './activity-calendar.component.html',
  styleUrls: ['./activity-calendar.component.scss'],
})
export class ActivityCalendarComponent {
  @Input() dayEvents: DayEvent[] = [];

  isDatesMatch(dayEvent: DayEvent, date: string): boolean {
    return formatDate(dayEvent.date, 'yyyy-MM-dd', 'en') == formatDate(date, 'yyyy-MM-dd', 'en');
  }
}
