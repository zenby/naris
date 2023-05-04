import { formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface DayEvent {
  title: string;
  date: string;
}

@Component({
  selector: 'soer-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  @Input() dayEvents: DayEvent[] = [];

  isDatesMatch(dayEvent: DayEvent, date: string): boolean {
    return formatDate(dayEvent.date, 'yyyy-MM-dd', 'en') == formatDate(date, 'yyyy-MM-dd', 'en');
  }
}
