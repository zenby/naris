import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { TextBlock } from '../../interfaces/document.model';
import { EditorBlocksRegistry, EDITOR_BLOCKS_REGISTRY_TOKEN } from '../../editor-blocks-config';
import { ControlBtn } from '../block-editor-controls/block-editor-controls.component';
import { BlockService } from '../../services/block.service';

@Component({
  selector: 'soer-block-editor',
  templateUrl: './block-editor.component.html',
  styleUrls: ['./block-editor.component.scss'],
})
export class BlockEditorComponent implements OnInit {
  @Input() id = '';
  @Input() textBlock: TextBlock = { type: 'markdown', text: '' };
  @Input() blocksLength = 0;

  @ViewChild('shadowEdit') shadowEdit!: ElementRef;
  @ViewChild('edit') edit!: ElementRef;
  @ViewChild('editView') editView!: ElementRef;

  isEdit = false;
  isFocused = false;
  controls: ControlBtn[] = [
    {
      title: 'Добавить (Alt+Enter)',
      icon: 'appstore-add',
      handler: () => this.addBlockDown(),
    },
    {
      title: 'Форматировать (Alt+C)',
      icon: 'scissor',
      handler: () => this.formatBlock(),
    },
    {
      title: 'Переместить вверх (Alt+Up)',
      icon: 'up',
      handler: () => this.moveUpBlock(),
    },
    {
      title: 'Переместить вниз (Alt+Down)',
      icon: 'down',
      handler: () => this.moveDownBlock(),
    },
    {
      title: 'Завершить редактирование (Esc)',
      icon: 'edit',
      handler: () => this.stopEdit(),
    },
    {
      title: 'Удалить (Alt+Backspace)',
      icon: 'delete',
      handler: () => this.removeCurrentBlock(),
    },
  ];

  constructor(
    @Inject(EDITOR_BLOCKS_REGISTRY_TOKEN) public editorBlocksRegistry: EditorBlocksRegistry,
    private blockService: BlockService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.blockService.onBlocksStateChange.subscribe((blockState) => {
      if (blockState[this.id]) {
        const currentState = blockState[this.id];
        this.isEdit = currentState.isEdit;
        this.isFocused = currentState.isFocused;
        if (currentState.isFocused) {
          this.edit?.nativeElement.focus();
        }
        this.cdr.markForCheck();
      }
    });
  }

  startEdit(): void {
    this.isEdit = true;
    this.isFocused = true;
    this.blockService.saveFocused(this.id);

    const curretnHeight = this.editView.nativeElement.scrollHeight;
    const heightText = this.editView.nativeElement.children[2].scrollHeight;
    if (curretnHeight < heightText) {
      this.editView.nativeElement.style.height = heightText + 2 + 'px';
    }
  }

  handleTextChange(): void {
    this.blockService.setBlockText(this.id, this.textBlock.text);
  }

  command(event: KeyboardEvent): void {
    if (event.code === 'Home') {
      this.setCaretToPos(0);
      event.preventDefault();
    }
    if (event.code === 'End') {
      event.preventDefault();
    }

    if (event.altKey && event.code === 'Enter') {
      this.addBlockDown();
      event.preventDefault();
    }

    if (event.altKey && event.code === 'KeyC') {
      this.formatBlock();
      event.preventDefault();
    }

    if (event.altKey && event.code === 'Backspace') {
      this.removeCurrentBlock();
      event.preventDefault();
    }

    if (event.altKey && event.code === 'ArrowUp') {
      this.moveUpBlock();
      event.preventDefault();

      return;
    }

    if (event.ctrlKey && event.code === 'ArrowUp') {
      this.setFocusOnPrevious();
      event.preventDefault();

      return;
    }

    if (event.code === 'ArrowUp' && this.getIsFirstLine(event)) {
      this.setFocusOnPrevious();
      event.preventDefault();
    }

    if (event.altKey && event.code === 'ArrowDown') {
      this.moveDownBlock();
      event.preventDefault();

      return;
    }

    if ((event.ctrlKey && event.code === 'ArrowDown') || event.code === 'Tab') {
      this.setFocusOnNext();
      event.preventDefault();

      return;
    }

    if (event.code === 'ArrowDown' && this.getIsLastLine(event)) {
      this.setFocusOnNext();
      event.preventDefault();
    }

    if (event.altKey && event.code === 'Digit1') {
      this.textBlock.type = 'markdown';
      event.preventDefault();
    }

    if (event.altKey && event.code === 'Digit2') {
      this.textBlock.type = 'test';
      event.preventDefault();
    }

    if (event.altKey && event.code === 'Digit3') {
      this.textBlock.type = 'code';
      event.preventDefault();
    }

    if (event.altKey && event.code === 'Digit4') {
      this.textBlock.type = 'diagram';
      event.preventDefault();
    }

    if (event.code === 'Escape') {
      this.stopEdit();
      event.preventDefault();
    }
  }

  stopEdit() {
    this.blockService.stopEdit(this.id);
    this.editView.nativeElement.style.height = 'auto';
  }

  private formatBlock() {
    this.blockService.format(this.id);
  }

  private addBlockDown(): void {
    this.blockService.addAfter(this.id);
  }

  private removeCurrentBlock(): void {
    this.blockService.remove(this.id);
  }

  private moveUpBlock(): void {
    this.blockService.moveUp(this.id);
  }

  private moveDownBlock(): void {
    this.blockService.moveDown(this.id);
  }

  private setFocusOnPrevious() {
    this.blockService.setFocusOnPrevious(this.id);
  }

  private setFocusOnNext() {
    this.blockService.setFocusOnNext(this.id);
  }

  private getIsFirstLine(event: KeyboardEvent) {
    return this.getLineNumberWhereCursorIs(event) === 1;
  }

  private getIsLastLine(event: KeyboardEvent) {
    return this.getLineNumberWhereCursorIs(event) === this.getCountOfLines(this.textBlock.text);
  }

  private getLineNumberWhereCursorIs(event: KeyboardEvent) {
    const cursorPosition = (event.target as HTMLInputElement)?.selectionStart || 0;
    const textBeforeCursor = this.textBlock.text.substring(0, cursorPosition);

    return this.getCountOfLines(textBeforeCursor);
  }

  private getCountOfLines(text: string) {
    //   const lineBreakRegExp = new RegExp(/\r\n|\r|\n/gm);

    this.shadowEdit.nativeElement.value = text;
    return Math.round((this.shadowEdit.nativeElement.scrollHeight - 17) / 21);

    //    return text.split(lineBreakRegExp).length;
  }

  private setSelectionRange(input: ElementRef, selectionStart: number, selectionEnd: number): void {
    if (input.nativeElement.setSelectionRange) {
      input.nativeElement.focus();
      input.nativeElement.setSelectionRange(selectionStart, selectionEnd);
    } else if (input.nativeElement.createTextRange) {
      const range = input.nativeElement.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
  }

  setCaretToPos(pos: number): void {
    this.setSelectionRange(this.edit, pos, pos);
  }
}
