import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileExtension',
})
export class FileExtensionPipe implements PipeTransform {
  transform(value: string, ..._args: unknown[]): unknown {
    return value.split('.').pop();
  }
}
