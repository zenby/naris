import { CommonModule } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { ActivityCalendarComponent } from './activity-calendar/activity-calendar.component';
import { ArrayFilterPipe } from './activity-calendar/pipes/array-filter.pipe';
import { DayClassPipe } from './activity-calendar/pipes/day-class.pipe';
import { ActivityTimelineComponent } from './activity-timeline/activity-timeline.component';

const ACTIVITY_COMPONENTS = [ActivityCalendarComponent, ActivityTimelineComponent];

@NgModule({
  declarations: [...ACTIVITY_COMPONENTS, ArrayFilterPipe, DayClassPipe],
  imports: [CommonModule, NzCalendarModule, NzTimelineModule],
  exports: [...ACTIVITY_COMPONENTS],
  providers: [{ provide: LOCALE_ID, useValue: 'ru' }],
})
export class ActivityModule {}
