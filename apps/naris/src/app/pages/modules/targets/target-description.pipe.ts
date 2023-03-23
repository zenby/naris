import { Pipe, PipeTransform } from '@angular/core';
import { TargetModel } from '../../../api/targets/target.interface';

@Pipe({
  name: 'targetDescription',
})
export class TargetDescriptionPipe implements PipeTransform {
  transform(target: TargetModel | null, path: string): string | null {
    if (path === 'root') {
      return target?.overview || '';
    }

    const pathIndexes = path.split('-').map((n) => +n);
    let tmp = target;

    for (let pointer = 1; pointer < pathIndexes.length; pointer++) {
      if (tmp && tmp.tasks) {
        const index = pathIndexes[pointer];
        tmp = tmp?.tasks[index] || null;
      }
    }
    return tmp?.overview || '';
  }
}
