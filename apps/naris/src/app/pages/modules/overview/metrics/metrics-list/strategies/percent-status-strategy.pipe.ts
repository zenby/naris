import { Pipe, PipeTransform } from '@angular/core';
import { TileStatus } from '@soer/soer-components';

@Pipe({
  name: 'percentStatusStrategy',
})
export class PercentStatusStrategyPipe implements PipeTransform {
  transform(value: number): TileStatus {
    if (value >= 1 && value < 10) {
      return 'critical';
    }

    if (value >= 10 && value < 60) {
      return 'warning';
    }

    if (value >= 60) {
      return 'normal';
    }

    return 'none';
  }
}
