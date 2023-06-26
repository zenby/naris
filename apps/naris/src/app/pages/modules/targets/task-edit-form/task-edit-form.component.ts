import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { convertToJsonDTO, parseJsonDTOPack } from '../../../../api/json.dto.helpers';
import { TargetModel } from '../../../../api/targets/target.interface';
import { CommandCancel, CommandDelete, CommandUpdate } from '@soer/sr-dto';
import { DtoPack } from '@soer/sr-dto';
import { DataStoreService } from '@soer/sr-dto';
import { MixedBusService } from '@soer/mixed-bus';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'soer-task-edit-form',
  templateUrl: './task-edit-form.component.html',
  styleUrls: ['./task-edit-form.component.scss'],
})
export class TaskEditFormComponent {
  target$: Observable<DtoPack<TargetModel>>;
  public history: { ind: number; title: string }[] = [];

  private targetId;
  constructor(
    private bus$: MixedBusService,
    private store$: DataStoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.targetId = this.route.snapshot.data['target'];
    this.target$ = parseJsonDTOPack<TargetModel>(this.store$.of(this.targetId), 'Targets edit');
  }

  onSave(target: TargetModel): void {
    this.bus$.publish(
      new CommandUpdate(
        this.targetId,
        { ...convertToJsonDTO(target, ['id']), id: target.id },
        { skipRoute: true, skipInfo: true }
      )
    );
  }

  onDelete(target: TargetModel): void {
    this.bus$.publish(new CommandDelete(this.targetId, target, { tid: target.id }));
  }

  onCreateTemplate(target: TargetModel): void {
    this.router.navigate(['/pages/targets', { outlets: { popup: ['target', target.id, 'template', 'create'] } }]);
  }

  onCancel(): void {
    this.bus$.publish(new CommandCancel(this.targetId));
  }
}
