import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanToString',
})
export class BooleanToStringPipe implements PipeTransform {
  transform(condition: boolean, exprIfTrue: string, exprIfFalse: string): string {
    return condition ? exprIfTrue : exprIfFalse;
  }
}
