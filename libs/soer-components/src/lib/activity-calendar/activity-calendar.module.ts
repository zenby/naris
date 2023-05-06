import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';

import { ActivityCalendarComponent } from './activity-calendar.component';
import { ArrayFilterPipe } from './pipes/array-filter.pipe';
import { DayClassPipe } from './pipes/day-class.pipe';

@NgModule({
  declarations: [ActivityCalendarComponent, ArrayFilterPipe, DayClassPipe],
  imports: [CommonModule, NzCalendarModule],
  exports: [ActivityCalendarComponent],
})
export class ActivityCalendarModule {}
