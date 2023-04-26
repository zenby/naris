import { Pipe, PipeTransform } from '@angular/core';
import { TileStatus } from '@soer/soer-components';

@Pipe({
  name: 'countStatusStrategy',
})
export class CountStatusStrategyPipe implements PipeTransform {
  transform(value: number | string | null): TileStatus {
    if (value === null) {
      value = 0;
    }
    value = parseInt(value + '', 10);
    if (value === 0) {
      return 'critical';
    }

    if (value > 0 && value < 5) {
      return 'warning';
    }

    if (value >= 5) {
      return 'normal';
    }

    return 'none';
  }
}
