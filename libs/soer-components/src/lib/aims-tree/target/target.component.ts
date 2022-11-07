import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AimModel, EMPTY_AIM } from '../interfaces/aim.model';
import { TargetService } from '../target.service';

@Component({
  selector: 'soer-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TargetComponent {
  public readonly gradientColors = { '0%': '#ff0000', '50%': '#ff0000', '75%': '#ff9900', '100%': '#0f0' };

  public isEdit = false;
 
  @Input() target: AimModel = EMPTY_AIM;
  @Output() update: EventEmitter<AimModel> = new EventEmitter<AimModel>();
  @Output() edit: EventEmitter<AimModel> = new EventEmitter<AimModel>();
  @Output() delete: EventEmitter<AimModel> = new EventEmitter<AimModel>();

  constructor(private targetService: TargetService) {}

  check(task: AimModel, target: AimModel): void {
    this.targetService.check(task, target);
    this.update.emit(target);
  }

  onSave(): void {
    this.isEdit = false;
    this.update.emit(this.target);
  }
  onEdit(): void {
    this.edit.emit(this.target);
  }

  onAddTo(aim: AimModel): void {
    this.targetService.factory(this.target).addTaskTo(aim);
  }

  onDelete(aim: AimModel): void {
    this.targetService.factory(this.target).delete(aim);
  }

  onAction(action: string): void {
    switch(action) {
      case 'plus':
        this.onAddTo(this.target);
        break;
      case 'save':
        this.onSave();
        break;
    }
  }

}
