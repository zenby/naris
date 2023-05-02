import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';

import { CalendarComponent } from './calendar.component';

@NgModule({
  declarations: [CalendarComponent],
  imports: [CommonModule, NzCalendarModule],
  exports: [CalendarComponent],
})
export class CalendarModule {}
