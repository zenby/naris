import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'soer-inline-text-edit',
  templateUrl: './inline-editor.component.html',
  styleUrls: ['./inline-editor.component.scss'],
})
export class InlineEditorComponent implements AfterViewInit {
  @Input() text = '';
  @Output() textChange = new EventEmitter<string>();
  @Output() readonly ok = new EventEmitter<string>(true);
  @Output() readonly cancel = new EventEmitter<string>(true);
  beforeText = '';
  currentText = '';
  @ViewChild('textarea', { static: false }) textarea!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(): void {
    this.beforeText = this.currentText = this.text;
    this.focusAndSet();
  }

  confirm(): void {
    setTimeout(() => {
      if (this.currentText !== this.beforeText) {
        this.ok.emit(this.currentText);
      } else {
        this.onCancel();
      }
    }, 100);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.currentText = target.value;
    this.textChange.emit(target.value);
  }

  onEnter(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.confirm();
  }

  onCancel(): void {
    this.textChange.emit(this.beforeText);
    this.cancel.emit(this.currentText);
  }

  private focusAndSet(): void {
    if (this.textarea?.nativeElement) {
      setTimeout(() => {
        this.textarea.nativeElement.value = this.currentText || '';
        this.textarea.nativeElement.focus();
      }, 0);
    }
  }
}
