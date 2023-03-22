import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStoreService, DtoPack } from '@soer/sr-dto';
import { TargetModel } from '../../../../api/targets/target.interface';
import { parseJsonDTOPack } from '../../../../api/json.dto.helpers';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type DescriptionExtras =
  | undefined
  | {
      descriptionPath?: string;
    };

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
      <div>{{ description$ | async }}</div>
    </div>
  `,
})
export class TargetDescriptionComponent {
  public target$: Observable<DtoPack<TargetModel>>;
  public description$?: Observable<string | undefined>;

  constructor(private store$: DataStoreService, private route: ActivatedRoute, private router: Router) {
    const targetId = this.route.snapshot.data['target'];
    this.target$ = parseJsonDTOPack<TargetModel>(this.store$.of(targetId), 'Targets edit');
    const state = this.router.getCurrentNavigation()?.extras?.state as DescriptionExtras;
    this.description$ = this.target$.pipe(
      map((targetModel) => {
        if (targetModel.status === 'ok' && state?.descriptionPath) {
          const path = state.descriptionPath.split(':').map((i) => Number(i));
          const isRootDescription = state.descriptionPath === '-1';
          if (isRootDescription) {
            return targetModel.items[0].overview;
          }
          let _description;
          for (const index of path) {
            if (!_description) {
              _description = targetModel.items[index];
              continue;
            }
            _description = _description.tasks[index];
          }
          return _description?.overview;
        }
        return;
      })
    );
  }
}
