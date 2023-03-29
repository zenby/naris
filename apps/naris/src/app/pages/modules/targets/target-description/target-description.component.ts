import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataStoreService, DtoPack } from '@soer/sr-dto';
import { TargetModel } from '../../../../api/targets/target.interface';
import { parseJsonDTOPack } from '../../../../api/json.dto.helpers';
import { Observable } from 'rxjs';

@Component({
  selector: 'soer-target-description',
  styles: [
    `
      .description {
        padding: 1rem;
        min-height: 100%;
        max-height: 100%;
        overflow-y: scroll;
      }
    `,
  ],
  template: `
    <div class="description">
      <ng-container *ngIf="target$ | async as targetDTO; else loading">
        <markdown *ngFor="let target of targetDTO.items">{{ target | targetDescription: path }}</markdown>
      </ng-container>
    </div>
    <ng-template #loading><nz-spin></nz-spin></ng-template>
  `,
})
export class TargetDescriptionComponent {
  public target$: Observable<DtoPack<TargetModel>>;
  public description$?: Observable<string | undefined>;

  path = '';
  constructor(private store$: DataStoreService, private route: ActivatedRoute) {
    const targetId = this.route.snapshot.data['target'];
    this.path = route.snapshot.params['path'];
    this.target$ = parseJsonDTOPack<TargetModel>(this.store$.of(targetId), 'Targets edit');
  }
}
