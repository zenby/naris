import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'soer-inline-text-edit',
  template: `
      <textarea #textarea
          (blur)="confirm()"
          (input)="onInput($event)"
          (keydown.esc)="onCancel()"
          (keydown.enter)="onEnter($event)"
      ></textarea>
      <button nz-button nzSize="large" nzType="link" (click)="onEnter($event)" [disabled]="currentText.length === 0"><i nz-icon nzType="check-circle"></i></button>
      <button nz-button nzDanger nzSize="large" nzType="link" (click)="onCancel()"><i nz-icon nzType="close-circle"></i></button>
  `,
  styleUrls: ['./inline-editor.component.scss']
})
export class InlineEditorComponent implements AfterViewInit {

  @Input() srText = '';
  @Output() srTextChange = new EventEmitter<string>();
  @Output() readonly ok = new EventEmitter<string>(true);
  @Output() readonly cancel = new EventEmitter<string>(true);
  beforeText = '';
  currentText = '';
  @ViewChild('textarea', { static: false }) textarea!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(): void {
    this.beforeText = this.currentText =  this.srText;
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
    this.srTextChange.emit(target.value);
  }

  onEnter(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.confirm();
  }

  onCancel(): void {
    this.srTextChange.emit(this.beforeText);
    this.cancel.emit(this.currentText);
  }

  private focusAndSet(): void {
    if (this.textarea?.nativeElement) {
      setTimeout( () => {
        this.textarea.nativeElement.value = this.currentText || '';
        this.textarea.nativeElement.focus();
      }, 0);
    }
  }
}
