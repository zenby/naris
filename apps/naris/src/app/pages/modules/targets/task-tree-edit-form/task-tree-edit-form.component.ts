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
  };

  @Input() history: { ind: number; title: string }[] = [];

  @Output() readonly save = new EventEmitter<TargetModel>();
  @Output() readonly historyChange = new EventEmitter<{ ind: number; title: string }[]>();
  @Output() readonly cancel = new EventEmitter<boolean>();
  @Output() readonly inTemplate = new EventEmitter<TargetModel>();
  @Output() readonly delete = new EventEmitter<TargetModel>();

  public activeTarget: TargetModel | undefined;
  public isEdit = true;
  public isEditTask = false;
  public editTaskByIndex = -1;

  ngOnChanges(): void {
    this.applyHistory(this.history);
    this.autoEditTask();
  }

  onActiveTask(target: TargetModel, ind: number): void {
    this.isEditTask = true;
    this.history.push({ ind, title: target.title });
    this.applyHistory(this.history);
  }

  autoEditTask(): boolean {
    const items = this.activeTarget?.tasks || [];
    items.forEach((task, index) => {
      if (task.title === '') {
        this.editTaskByIndex = index;
      }
    });
    return false;
  }

  onCancelEdit(value: string): void {
    if (value === '') {
      this.onDeleteTask(this.target, this.editTaskByIndex);
    }
    this.editTask(-1);
  }

  editTask(ind: number): void {
    this.editTaskByIndex = ind;
  }

  createTask(target: TargetModel): void {
    target.tasks = target.tasks || [];
    target.tasks.push({ title: '', overview: '', progress: 0, tasks: [] });
    updateProgress(this.target);
    this.save.next(this.target);
  }

  onDeleteTask(target: TargetModel, ind: number): void {
    target.tasks = target.tasks.filter((_, taskIndex) => taskIndex !== ind);
    updateProgress(this.target);
    this.save.next(this.target);
  }

  onSaveTask(target: TargetModel, item: string): void {
    if (item.length > 0) {
      this.save.emit(target);
      this.editTaskByIndex = -1;
    } else {
      this.onDeleteTask(this.target, this.editTaskByIndex);
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

  private applyHistory(history: { ind: number; title: string }[] = []): void {
    this.activeTarget = this.target;
    history.forEach((item) => (this.activeTarget = this.activeTarget?.tasks[item.ind]));
  }
}
