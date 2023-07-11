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
import { EMPTY_WORKBOOK, WorkbookModel } from '@soer/sr-editor';
import { ComponentCanDeactivate } from '../../../../guards/confirm-page-leave.guard';
import { map, Observable } from 'rxjs';
import { convertToJsonDTO } from '../../../../api/json.dto.helpers';
import { EditAbstracteFormComponent } from '../edit-abstracte-form/edit-abstracte-form.component';

@Component({
  selector: 'soer-edit-abstracte-page',
  templateUrl: './edit-abstracte-page.component.html',
  styleUrls: ['./edit-abstracte-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAbstractePageComponent implements ComponentCanDeactivate {
  public workbook$: Observable<WorkbookModel[]>;
  private workbookId: BusEmitter;

  @ViewChild(EditAbstracteFormComponent) editForm: EditAbstracteFormComponent | null = null;

  constructor(private bus$: MixedBusService, private store$: DataStoreService, private route: ActivatedRoute) {
    this.workbookId = this.route.snapshot.data['workbook'];
    this.workbook$ = deSerializeJson<WorkbookModel>(
      extractDtoPackFromBus<SerializedJsonModel>(this.store$.of(this.workbookId)),
      EMPTY_WORKBOOK
    );
  }

  canDeactivate(): boolean {
    return !this.editForm?.hasChanges();
  }

  onSave(workbook: WorkbookModel): void {
    if (workbook.id === null) {
      this.bus$.publish(
        new CommandCreate(this.workbookId, convertToJsonDTO(workbook, ['id']), { afterCommandDoneRedirectTo: ['.'] })
      );
    } else {
      this.bus$.publish(new CommandUpdate(this.workbookId, { ...convertToJsonDTO(workbook, ['id']), id: workbook.id }));
    }
  }
}
