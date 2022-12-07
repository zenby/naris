import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DelimitEvent, TextBlock } from '../../interfaces/document.model';

@Component({
  selector: 'soer-block-editor',
  templateUrl: './block-editor.component.html',
  styleUrls: ['./block-editor.component.scss'],
})
export class BlockEditorComponent {
  @Input() textBlock: TextBlock = { type: 'markdown', text: '' };

  @ViewChild('edit') set editRef(ref: ElementRef) {
    if (ref) {
      ref.nativeElement.focus();
    }
  }
  @Input() localIndex = -1;
  @Input() isEdit = false;
  @Input() blockDelimeter: string | undefined;

  @Output() addBlock = new EventEmitter<number>();
  @Output() removeBlock = new EventEmitter<number>();
  @Output() endEdit = new EventEmitter<number>();
  @Output() moveUp = new EventEmitter<number>();
  @Output() moveDown = new EventEmitter<number>();
  @Output() setActive = new EventEmitter<number>();
  @Output() markdownTextChange = new EventEmitter<string>();
  @Output() delimitBlock = new EventEmitter<DelimitEvent>();

  onSelectBlock(): void {
    this.setActive.next(this.localIndex);
  }

  textChange(changedText: string) {
    this.markdownTextChange.emit(changedText);

    if (this.blockDelimeter && changedText.includes(this.blockDelimeter)) {
      this.delimitBlock.emit({ text: changedText, type: this.textBlock.type });
    }
  }

  command($event: KeyboardEvent): void {
    if ($event.altKey && $event.code === 'Enter') {
      this.endEdit.next(this.localIndex);
      this.isEdit = false;
      this.addBlock.next(this.localIndex);
    }

    if ($event.altKey && $event.code === 'Backspace') {
      this.endEdit.next(this.localIndex);
      this.isEdit = false;
      this.removeBlock.next(this.localIndex);
    }

    if ($event.altKey && $event.code === 'ArrowUp') {
      this.moveUp.next(this.localIndex);
    }

    if ($event.altKey && $event.code === 'ArrowDown') {
      this.moveDown.next(this.localIndex);
    }

    if ($event.altKey && $event.code === 'Digit1') {
      this.textBlock.type = 'markdown';
    }

    if ($event.altKey && $event.code === 'Digit2') {
      this.textBlock.type = 'test';
    }

    if ($event.code === 'Escape') {
      this.isEdit = false;
    }
  }

  onEndEdit(): void {
    this.isEdit = false;
    this.endEdit.next(this.localIndex);
  }
}
