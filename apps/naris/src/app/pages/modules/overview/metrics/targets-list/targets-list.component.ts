import { Component, Input } from '@angular/core';
import { DtoPack } from '@soer/sr-dto';
import { TargetModel } from '../../../../../api/targets/target.interface';
@Component({
  selector: 'soer-targets-list',
  templateUrl: 'targets-list.component.html',
  styleUrls: ['../metrics.component.scss'],
})
export class TargetsListComponent {
  @Input() targets: DtoPack<TargetModel> | null = null;
}
