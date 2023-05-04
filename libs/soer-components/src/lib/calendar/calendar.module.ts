import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';

import { CalendarComponent } from './calendar.component';
import { ArrayFilterPipe } from './pipes/array-filter.pipe';
import { DayClassPipe } from './pipes/day-class.pipe';

@NgModule({
  declarations: [CalendarComponent, ArrayFilterPipe, DayClassPipe],
  imports: [CommonModule, NzCalendarModule],
  exports: [CalendarComponent],
})
export class CalendarModule {}
