import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusEmitter, MixedBusService } from '@soer/mixed-bus';
import {
  CommandCreate,
  CommandUpdate,
  DataStoreService,
  deSerializeJson,
  extractDtoPackFromBus,
  SerializedJsonModel,
} from '@soer/sr-dto';
import { TargetModel, EMPTY_TARGET } from '../../../../api/targets/target.interface';
import { ComponentCanDeactivate } from '../../../../guards/confirm-page-leave.guard';
import { map, Observable } from 'rxjs';
import { convertToJsonDTO } from '../../../../api/json.dto.helpers';
import { TargetDescriptionFormComponent } from '../target-description-form/target-description-form.component';

@Component({
  selector: 'soer-target-description-popup',
  templateUrl: './target-description-popup.component.html',
  styleUrls: ['./target-description-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TargetDescriptionPopupComponent implements ComponentCanDeactivate {
  public target$: Observable<TargetModel[]>;
  private targetId: BusEmitter;

  @ViewChild(TargetDescriptionFormComponent) editForm: TargetDescriptionFormComponent | null = null;

  constructor(private bus$: MixedBusService, private store$: DataStoreService, private route: ActivatedRoute) {
    this.targetId = this.route.snapshot.data['target'];
    this.target$ = deSerializeJson<TargetModel>(
      extractDtoPackFromBus<SerializedJsonModel>(this.store$.of(this.targetId)),
      EMPTY_TARGET
    ).pipe(
      map<TargetModel[], TargetModel[]>((data) => {
        //TODO: Конвертировать все Target в формат без overview
        // и убрать этот pipe
        data.forEach((t) => {
          if (!t.blocks || t.overview) {
            t.blocks = [{ text: t.overview || '', type: 'markdown' }];
            t.overview = '';
          }
        });
        return data;
      })
    );
  }

  canDeactivate(): boolean {
    return !this.editForm?.hasChanges();
  }

  onSave(target: TargetModel): void {
    if (target.id === null) {
      this.bus$.publish(
        new CommandCreate(this.targetId, convertToJsonDTO(target, ['id']), { afterCommandDoneRedirectTo: ['.'] })
      );
    } else {
      this.bus$.publish(new CommandUpdate(this.targetId, { ...convertToJsonDTO(target, ['id']), id: target.id }));
    }
  }
}
