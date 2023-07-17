import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CalendarDataService } from './calendar-page.service';
import { ActivityEventModel } from '@soer/soer-components';

@Component({
  selector: 'soer-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarPageComponent implements OnInit {
  public activities$: Observable<ActivityEventModel[]> = of([]);

  constructor(private calendarDataService: CalendarDataService) {}

  ngOnInit(): void {
    this.initActivitiesObservable();
  }

  private initActivitiesObservable(): void {
    this.activities$ = this.calendarDataService.getActivities$();
  }
}
