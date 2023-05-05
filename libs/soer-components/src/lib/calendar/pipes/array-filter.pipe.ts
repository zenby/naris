import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayFilter',
})
export class ArrayFilterPipe<T> implements PipeTransform {
  transform(arr: Array<T>, value: string | number, filter: (item: T, value: string | number) => boolean): Array<T> {
    return arr.filter((item) => filter(item, value));
  }
}
