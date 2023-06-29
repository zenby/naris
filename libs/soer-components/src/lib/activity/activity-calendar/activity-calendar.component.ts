import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ru_RU, NzI18nService } from 'ng-zorro-antd/i18n';
import { ActivityEvent } from '../activity-event';

@Component({
  selector: 'soer-activity-calendar',
  templateUrl: './activity-calendar.component.html',
  styleUrls: ['./activity-calendar.component.scss'],
})
export class ActivityCalendarComponent implements OnInit {
  @Input() dayEvents: ActivityEvent[] = [];

  constructor(private i18n: NzI18nService) {}

  ngOnInit() {
    this.i18n.setLocale(ru_RU);
  }

  isDatesMatch(dayEvent: ActivityEvent, date: string): boolean {
    return formatDate(dayEvent.date, 'yyyy-MM-dd', 'en') == formatDate(date, 'yyyy-MM-dd', 'en');
  }
}
