import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TargetModel } from '../../../../api/targets/target.interface';
import { updateProgress } from '../progress.helper';

@Component({
  selector: 'soer-task-tree-edit-form',
  templateUrl: './task-tree-edit-form.component.html',
  styleUrls: ['./task-tree-edit-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTreeEditFormComponent implements OnChanges {
  @Input() target: TargetModel = {
    title: '',
    overview: '',
    progress: 0,
    tasks: [],
    blocks: [{ text: '', type: 'markdown' }],
  };

  @Input() history: { ind: number; title: string }[] = [];

  @Output() readonly save = new EventEmitter<TargetModel>();
  @Output() readonly historyChange = new EventEmitter<{ ind: number; title: string }[]>();
  @Output() readonly cancel = new EventEmitter<boolean>();
  @Output() readonly inTemplate = new EventEmitter<TargetModel>();
  @Output() readonly delete = new EventEmitter<TargetModel>();

  public activeTarget: TargetModel | undefined;
  public isEditDescription = false;
  public isEditTask = false;
  public editTaskIndex = -1;

  private _tempDescription = '';

  ngOnChanges(): void {
    this.applyHistory(this.history);
    this.autoEditTask();
  }

  autoEditTask(): boolean {
    const items = this.activeTarget?.tasks || [];
    items.forEach((task, index) => {
      if (task.title === '') {
        this.editTaskIndex = index;
      }
    });
    return false;
  }

  setEditTaskIndex(ind: number): void {
    this.editTaskIndex = ind;
  }

  createTask(target: TargetModel): void {
    target.tasks = target.tasks || [];
    target.tasks.push({ title: '', overview: '', progress: 0, tasks: [], blocks: [{ text: '', type: 'markdown' }] });
    updateProgress(this.target);
    this.save.next(this.target);
  }

  onActiveTask(target: TargetModel, ind: number): void {
    this.isEditTask = true;
    this.history.push({ ind, title: target.title });
    this.applyHistory(this.history);
  }

  onCancelEdit(target: TargetModel, value: string): void {
    if (value === '') {
      this.onDeleteTask(target, this.editTaskIndex);
    }
    this.editTaskIndex = -1;
  }

  onDeleteTask(target: TargetModel, ind: number): void {
    target.tasks = target.tasks.filter((_, taskIndex) => taskIndex !== ind);
    updateProgress(this.target);
    this.save.next(this.target);
  }

  onSaveTask(target: TargetModel, item: string): void {
    if (item.length > 0) {
      this.save.emit(target);
      this.editTaskIndex = -1;
    } else {
      this.onDeleteTask(this.target, this.editTaskIndex);
    }
  }

  onUndoTask(target: TargetModel, ind: number): void {
    target.tasks[ind].progress = 0;
    updateProgress(this.target);
    this.save.next(this.target);
  }

  truncateHistory(ind: number): void {
    this.history = this.history.filter((_, i) => i < ind);
    this.historyChange.next(this.history);
    this.applyHistory(this.history);
  }

  onStartEditDescription(description: string) {
    this._tempDescription = description;
    this.isEditDescription = true;
  }

  onCancelEditDescription() {
    this.target.overview = this._tempDescription;
    this.isEditDescription = false;
  }

  private applyHistory(history: { ind: number; title: string }[] = []): void {
    this.activeTarget = this.target;
    history.forEach((item) => (this.activeTarget = this.activeTarget?.tasks[item.ind]));
  }
}
