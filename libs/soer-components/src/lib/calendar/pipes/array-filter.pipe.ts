import { Pipe, PipeTransform } from '@angular/core';
import { DayEvent } from '../calendar.component';

@Pipe({
  name: 'arrayFilter',
})
export class ArrayFilterPipe implements PipeTransform {
  transform(arr: Array<DayEvent>, value: string, filter: (item: DayEvent, value: string) => boolean): Array<DayEvent> {
    return arr.filter((item) => filter(item, value));
  }
}
