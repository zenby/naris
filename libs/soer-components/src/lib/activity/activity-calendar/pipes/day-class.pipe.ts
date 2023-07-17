import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayClass',
})
export class DayClassPipe<T> implements PipeTransform {
  transform(arr: Array<T>, date: string): string {
    if (new Date(date) > new Date()) return 'day-in-future';

    return arr.length > 0 ? 'day-with-activity' : 'day-without-activity';
  }
}
