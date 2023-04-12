import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
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
import { ComponentCanDeactivate } from '../../../../guards/pending-changes-guard.guard';
import { map, Observable } from 'rxjs';
import { convertToJsonDTO } from '../../../../api/json.dto.helpers';

@Component({
  selector: 'soer-edit-abstracte-page',
  templateUrl: './edit-abstracte-page.component.html',
  styleUrls: ['./edit-abstracte-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAbstractePageComponent implements ComponentCanDeactivate {
  public workbook$: Observable<WorkbookModel[]>;
  private workbookId: BusEmitter;
  constructor(private bus$: MixedBusService, private store$: DataStoreService, private route: ActivatedRoute) {
    this.workbookId = this.route.snapshot.data['workbook'];
    this.workbook$ = deSerializeJson<WorkbookModel>(
      extractDtoPackFromBus<SerializedJsonModel>(this.store$.of(this.workbookId)),
      EMPTY_WORKBOOK
    ).pipe(
      map<WorkbookModel[], WorkbookModel[]>((data) => {
        //TODO: Конвертировать все Workbook в формат без text
        // и убрать этот pipe
        data.forEach((w) => {
          if (!w.blocks && w.text) {
            w.blocks = [{ text: w.text || '', type: 'markdown' }];
            w.text = '';
          }
        });
        return data;
      })
    );
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return false;
  }

  getConfirmMessage(): string {
    return 'Вы точно хотите прекратить редактирование?';
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
