import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AimModel } from '../interfaces/aim.model';

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

  doneProgress = 100;

  onDescription($event: number[]) {
    this.description.emit($event);
  }
}
