import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TargetModel, EMPTY_TARGET } from '../../../../api/targets/target.interface';

@Component({
  selector: 'soer-target-description-form',
  templateUrl: './target-description-form.component.html',
  styleUrls: ['./target-description-form.component.scss'],
})
export class TargetDescriptionFormComponent implements AfterViewInit {
  @Input() target: TargetModel = EMPTY_TARGET;
  @Output() save = new EventEmitter<TargetModel>();
  public previewFlag = true;
  private prevTarget = '';
  public activeTarget: TargetModel = EMPTY_TARGET;
  private route: ActivatedRoute;

  constructor(route: ActivatedRoute) {
    this.route = route;
  }

  ngAfterViewInit(): void {
    const path: string = this.route.snapshot.params['path'];

    this.activeTarget = this.target;
    if (path && !(path === 'root')) {
      const pathIndexes = path.split('-').map((n) => +n);

      for (let pointer = 1; pointer < pathIndexes.length; pointer++) {
        if (this.activeTarget && this.activeTarget.tasks) {
          const index = pathIndexes[pointer];
          this.activeTarget = this.activeTarget.tasks[index];
        }
      }
    }

    // TODO: исправить шаблоны для использования blocks и удалить данный if
    if (!this.activeTarget.blocks) {
      this.activeTarget.blocks = [{ text: '', type: 'markdown' }];
    }

    this.prevTarget = JSON.stringify(this.activeTarget);
  }

  hasChanges() {
    return this.prevTarget != JSON.stringify(this.activeTarget);
  }

  onCancel() {
    this.prevTarget = JSON.stringify(this.activeTarget);
  }

  onSave() {
    this.save.emit(this.target);
    this.previewFlag = true;
  }
}
