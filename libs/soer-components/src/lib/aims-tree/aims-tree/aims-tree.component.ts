import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AimModel, AimVideoAction } from '../interfaces/aim.model';

@Component({
  selector: 'soer-aims-tree',
  templateUrl: './aims-tree.component.html',
  styleUrls: ['./aims-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AimsTreeComponent {
  @Input() isEdit = false;
  @Input() hideCompleted = false;
  @Input() tasks: AimModel[] = [];
  @Input() aimIndex!: number;
  @Output() add: EventEmitter<AimModel> = new EventEmitter<AimModel>();
  @Output() delete: EventEmitter<AimModel> = new EventEmitter<AimModel>();
  @Output() update: EventEmitter<AimModel> = new EventEmitter<AimModel>();
  @Output() taskClose: EventEmitter<AimModel> = new EventEmitter<AimModel>();
  @Output() description: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() video: EventEmitter<AimVideoAction> = new EventEmitter<AimVideoAction>();

  doneProgress = 100;

  onVideo($event: AimVideoAction) {
    this.video.emit($event);
  }

  onDescription($event: number[]) {
    this.description.emit($event);
  }
}
