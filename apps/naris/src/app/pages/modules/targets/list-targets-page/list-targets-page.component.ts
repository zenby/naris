import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ANY_SERVICE, BusEmitter, MixedBusService } from '@soer/mixed-bus';
import { AimModel, AimVideoAction } from '@soer/soer-components';
import { CommandDelete, CommandUpdate, DataStoreService, DtoPack, OK } from '@soer/sr-dto';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { filter, first, Observable } from 'rxjs';
import { convertToJsonDTO, parseJsonDTOPack } from '../../../../api/json.dto.helpers';
import { TargetModel, Visibility } from '../../../../api/targets/target.interface';
import { DONE_PROGRESS, TargetKey, UNDONE_PROGRESS } from '../targets.const';
import { TaskClosedEvent } from '../events/task-closed.event';
import { TargetAchievedEvent } from '../events/target-achieved.event';

@Component({
  selector: 'soer-list-targets-page',
  templateUrl: './list-targets-page.component.html',
  styleUrls: ['./list-targets-page.component.scss'],
})
export class ListTargetsPageComponent implements OnInit {
  checked = false;
  public targets$: Observable<DtoPack<TargetModel>>;
  public visibility: Visibility = {};

  public readonly doneProgress = DONE_PROGRESS;
  public readonly undoneProgress = UNDONE_PROGRESS;
  public readonly gradientColors = { '0%': '#ff0000', '50%': '#ff0000', '75%': '#ff9900', '100%': '#0f0' };
  public expanderCache: Visibility = {};
  public isSingleMode: boolean;

  private targetsId: BusEmitter<TargetKey>;

  constructor(
    @Inject('target') private targetId: BusEmitter,
    private bus$: MixedBusService,
    private store$: DataStoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.targetsId = this.route.snapshot.data['targets'];
    this.targets$ = parseJsonDTOPack<TargetModel>(this.store$.of(this.targetsId), 'Targets');
    this.isSingleMode = this.route.snapshot.params['tid'] !== undefined;
  }

  ngOnInit() {
    this.createTasksVisibility();
  }

  onUpdate(target: AimModel): void {
    const tmpTargetId = { ...this.targetId, key: { tid: target.id } };
    this.bus$.publish(
      new CommandUpdate(
        tmpTargetId,
        { ...convertToJsonDTO(target, ['id']), id: target.id },
        { skipRoute: true, skipSyncRead: true }
      )
    );
  }

  onDelete(target: AimModel): void {
    const tmpTargetId = { ...this.targetId, key: { tid: target.id } };
    this.bus$.publish(
      new CommandDelete(
        tmpTargetId,
        {},
        {
          tid: target.id,
          afterCommandDoneRedirectTo: ['.'],
          skipSyncRead: true,
        }
      )
    );
  }

  onTaskClose(target: AimModel, task: AimModel): void {
    this.bus$.publish(new TaskClosedEvent(ANY_SERVICE, task as TargetModel));
    if (target.progress === 100) {
      this.bus$.publish(new TargetAchievedEvent(ANY_SERVICE, target as TargetModel));
    }
  }

  createTasksVisibility(): void {
    this.targets$
      .pipe(
        filter((target) => target.status === OK),
        first()
      )
      .subscribe((target) => {
        const visibility = target.items.reduce((acc: Visibility, curr: TargetModel) => {
          acc[curr.id || 0] = this.isSingleMode;
          return acc;
        }, {});

        this.visibility = visibility;
      });
  }

  toggleTaskVisibility(taskId: TargetModel['id']): void {
    if (taskId) {
      this.visibility[taskId] = !this.visibility[taskId];
    }
  }

  onEdit(target: AimModel): void {
    this.router.navigate(['/pages/targets', { outlets: { popup: ['target', 'edit', target.id] } }]);
  }

  onDescription(descriptionPath: number[], id: TargetModel['id']) {
    const path = descriptionPath.map((pathId) => (pathId === -1 ? 'root' : pathId)).join('-');
    const outlets = { popup: ['target', String(id), 'description', path] };
    this.router.navigate(['/pages/targets', { outlets }]);
  }

  onVideo(videoLinkAction: AimVideoAction) {
    if (videoLinkAction.isEdit) {
      const newId =
        videoLinkAction.linkVideoId === -1
          ? 0
          : prompt('Укажите номер ссылки', (videoLinkAction.linkVideoId || 0).toString());
      if (newId) {
        videoLinkAction.aim.linkVideoId = +newId;
      } else {
        videoLinkAction.aim.linkVideoId = undefined;
      }
      return;
    }
    const id = videoLinkAction.linkVideoId;
    if (id) {
      const outlets = { popup: ['link', String(id), 'video'] };
      this.router.navigate(['/pages/targets', { outlets }]);
      return;
    }
    console.error('Невозможно обработать действие ', videoLinkAction);
  }
}
