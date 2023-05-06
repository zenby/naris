import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ru_RU, NzI18nService } from 'ng-zorro-antd/i18n';

export interface DayEvent {
  title: string;
  date: string;
}

@Component({
  selector: 'soer-activity-calendar',
  templateUrl: './activity-calendar.component.html',
  styleUrls: ['./activity-calendar.component.scss'],
})
export class ActivityCalendarComponent implements OnInit {
  @Input() dayEvents: DayEvent[] = [];
  constructor(private i18n: NzI18nService) {}

  ngOnInit() {
    this.i18n.setLocale(ru_RU);
  }
  isDatesMatch(dayEvent: DayEvent, date: string): boolean {
    return formatDate(dayEvent.date, 'yyyy-MM-dd', 'en') == formatDate(date, 'yyyy-MM-dd', 'en');
  }
}
