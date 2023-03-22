import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'soer-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  @Input() label = '';
  @Input() hasOverview = false;
  @Input() checked = false;
  @Input() disabled = false;

  public isUndo = false;
  @Output() update: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() description: EventEmitter<null> = new EventEmitter<null>();

  constructor(private cdp: ChangeDetectorRef) {}

  toggle(): void {
    this.checked = !this.checked;
    this.isUndo = true;

    setTimeout(() => {
      this.isUndo = false;
      this.cdp.detectChanges();
    }, 5000);

    this.update.emit(this.checked);
  }
}
