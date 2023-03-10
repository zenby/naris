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
        max-height: 100%;
        overflow-y: scroll;
      }
    `,
  ],
  template: `
    <div class="description">
      <ng-container *ngIf="(target$ | async)?.items as targets">
        {{ targets[0].overview }}
      </ng-container>
    </div>
  `,
})
export class TargetDescriptionComponent {
  public target$: Observable<DtoPack<TargetModel>>;

  constructor(private store$: DataStoreService, private route: ActivatedRoute) {
    const targetId = this.route.snapshot.data['target'];
    this.target$ = parseJsonDTOPack<TargetModel>(this.store$.of(targetId), 'Targets edit');
  }
}
