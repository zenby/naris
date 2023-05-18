import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TargetModel } from '../../../../api/targets/target.interface';
import { BusEmitter } from '@soer/mixed-bus';
import { DescriptionService } from '../description.service';
import { Observable, tap } from 'rxjs';

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
      .controls {
        display: flex;
        column-gap: 0.3rem;
        position: sticky;
        top: 0;
        z-index: 1;
        margin-bottom: 1rem;
      }
    `,
  ],
  templateUrl: 'target-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TargetDescriptionComponent implements OnDestroy {
  public isEditMode = false;
  public description$: Observable<string | null>;

  constructor(route: ActivatedRoute, private descriptionService: DescriptionService) {
    const path = route.snapshot.params['path'];
    const targetEmitter = route.snapshot.data['target'] as BusEmitter<TargetModel>;
    this.descriptionService.init(targetEmitter, path);
    this.description = this.descriptionService.getDescription();
    this.description$ = this.descriptionService.description$.pipe(tap((desc) => (this.isEditMode = desc === '')));
  }

  public set description(description: string | null) {
    this.descriptionService.setDescription(description);
  }

  public get description(): string | null {
    return this.descriptionService.getDescription();
  }

  onCancel() {
    this.descriptionService.resetDescription();
    this.isEditMode = false;
  }

  onSave() {
    this.descriptionService.save();
    this.descriptionService.description$.next(this.description);
    this.isEditMode = false;
  }

  ngOnDestroy(): void {
    this.descriptionService.destroy();
  }
}
