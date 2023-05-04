import { Pipe, PipeTransform } from '@angular/core';
import { DayEvent } from '../calendar.component';

@Pipe({
  name: 'dayClass',
})
export class DayClassPipe implements PipeTransform {
  transform(arr: Array<DayEvent>, date: string): string {
    if (new Date(date) > new Date()) return 'day-in-future';

    return arr.length > 0 ? 'day-with-activity' : 'day-without-activity';
  }
}
