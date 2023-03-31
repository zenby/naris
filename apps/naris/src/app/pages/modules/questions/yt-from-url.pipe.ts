import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ytFromUrl',
})
export class YtFromUrlPipe implements PipeTransform {
  transform(value: string, ..._args: unknown[]): unknown {
    return value.split('.').splice(-2, 1).pop();
  }
}
