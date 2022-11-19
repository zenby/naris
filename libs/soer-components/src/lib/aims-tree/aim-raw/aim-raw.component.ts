import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { provideProtractorTestingSupport } from '@angular/platform-browser';
import { AimModel, EMPTY_AIM } from '../interfaces/aim.model';

@Component({
  selector: 'soer-aim-raw',
  templateUrl: './aim-raw.component.html',
  styleUrls: ['./aim-raw.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AimRawComponent implements OnChanges {
  public readonly gradientColors = { '0%': '#ff0000', '50%': '#ff0000', '75%': '#ff9900', '100%': '#0f0' };
  @Input() isTitleEdit = false;
  @Input() isExpand = false;
  @Input() isEdit = false;
  @Input() aim: AimModel = EMPTY_AIM;

  @Output() update: EventEmitter<AimModel> = new EventEmitter<AimModel>();
  @Output() add: EventEmitter<AimModel> = new EventEmitter<AimModel>();
  @Output() delete: EventEmitter<AimModel> = new EventEmitter<AimModel>();
  @Output() expand: EventEmitter<boolean> = new EventEmitter<boolean>();
  doneProgress = 100;
  actions = ['plus', 'edit', 'delete']
  inlineEditorActions = ['save', 'cancel'];


  ngOnChanges(data: SimpleChanges): void {
    if (data['aim']?.firstChange && this.isEdit) {
      this.isTitleEdit = true;
    }
  }
  toggle(): void {
    this.isExpand = !this.isExpand;
    this.expand.emit(this.isExpand);
  }

  toolbarAction(action: string, task: AimModel): void {
    switch(action) {
      case 'edit':
          this.isTitleEdit = !this.isTitleEdit;
        break;
      case 'plus':
         this.isExpand = true;
         this.add.emit(task)
        break;
      case 'delete':
        this.delete.emit(task);
        break;
    }
  }

  updateTitle(newTitle: string): void  {
    if (newTitle === '') {
      if (this.aim.tasks.length > 0) {
        return;
      }
      this.delete.emit(this.aim);
      return;
    }
    this.aim.title = newTitle;
    this.isTitleEdit = false;
  }
}
