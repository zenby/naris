import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { BasicBlockComponent } from '../basic-block.component';
import { TextBlock } from '../../interfaces/document.model';
import { EditorBlocksRegistry, EDITOR_BLOCKS_REGISTRY_TOKEN } from '../../editor-blocks-config';
import { ControlBtn } from '../block-editor-controls/block-editor-controls.component';

@Component({
  selector: 'soer-block-editor',
  templateUrl: './block-editor.component.html',
  styleUrls: ['./block-editor.component.scss'],
})
export class BlockEditorComponent implements AfterViewInit, AfterViewChecked {
  @Input() textBlock: TextBlock = { type: 'markdown', text: '' };
  @Input() localIndex = -1;
  @Input() isEdit = false;
  @Input() isActive = false;
  @Input() blocksLength = 0;
  @Input() blockDelimeter: string | undefined;

  @Output() addBlock = new EventEmitter<number>();
  @Output() removeBlock = new EventEmitter<number>();
  @Output() endEdit = new EventEmitter<number>();
  @Output() moveUp = new EventEmitter<number>();
  @Output() moveDown = new EventEmitter<number>();
  @Output() setActive = new EventEmitter<number>();
  @Output() markdownTextChange = new EventEmitter<string>();

  @ViewChild('edit') edit!: ElementRef;
  @ViewChild('editComponent', { static: true, read: ViewContainerRef }) editComponent!: ViewContainerRef;

  componentRef: ComponentRef<BasicBlockComponent> | null = null;

  constructor(@Inject(EDITOR_BLOCKS_REGISTRY_TOKEN) public editorBlocksRegistry: EditorBlocksRegistry) {}

  controls: ControlBtn[] = [
    {
      title: 'Добавить (Alt+Enter)',
      icon: 'appstore-add',
      handler: () => this.addBlockDown(),
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
      title: 'Удалить (Alt+Backspace)',
      icon: 'delete',
      handler: () => this.removeCurrentBlock(),
    },
  ];

  ngAfterViewChecked(): void {
    if (this.isActive && document.activeElement != this.edit?.nativeElement) {
      this.edit?.nativeElement.focus();
    }
  }

  ngAfterViewInit(): void {
    this.renderComponentForEditMode();
  }

  onSelectBlock(): void {
    this.setActive.next(this.localIndex);
  }

  textChange(changedText: string) {
    this.markdownTextChange.emit(changedText);
  }

  command(event: KeyboardEvent): void {
    if (this.componentRef) {
      this.componentRef.instance.text = this.textBlock.text;
    }

    if (event.altKey && event.code === 'Enter') {
      this.addBlockDown();
    }

    if (event.altKey && event.code === 'Backspace') {
      this.removeCurrentBlock();
    }

    if (event.altKey && event.code === 'ArrowUp') {
      this.moveUpBlock();

      return;
    }

    if (event.ctrlKey && event.code === 'ArrowUp') {
      this.setActivePreviousIfAvailable();

      return;
    }

    if (event.code === 'ArrowUp' && this.getIsFirstLine(event)) {
      this.setActivePreviousIfAvailable();
    }

    if (event.altKey && event.code === 'ArrowDown') {
      this.moveDownBlock();

      return;
    }

    if (event.ctrlKey && event.code === 'ArrowDown') {
      this.setActiveNextIfAvailable();

      return;
    }

    if (event.code === 'ArrowDown' && this.getIsLastLine(event)) {
      this.setActiveNextIfAvailable();
    }

    if (event.altKey && event.code === 'Digit1') {
      this.textBlock.type = 'markdown';
    }

    if (event.altKey && event.code === 'Digit2') {
      this.textBlock.type = 'test';
    }

    if (event.altKey && event.code === 'Digit3') {
      this.textBlock.type = 'code';
    }

    if (event.code === 'Escape') {
      this.stopEdit();
    }
  }

  stopEdit() {
    this.endEdit.next(this.localIndex);
    this.isEdit = false;
    if (this.componentRef) {
      this.componentRef.instance.text = this.textBlock.text;
    }
  }

  private addBlockDown(): void {
    this.addBlock.next(this.localIndex);
  }

  private removeCurrentBlock(): void {
    this.removeBlock.next(this.localIndex);
  }

  private moveUpBlock(): void {
    this.moveUp.next(this.localIndex);
  }

  private moveDownBlock(): void {
    this.moveDown.next(this.localIndex);
  }

  private setActivePreviousIfAvailable() {
    if (this.localIndex <= 0) return;

    this.setActive.next(this.localIndex - 1);
  }

  private setActiveNextIfAvailable() {
    if (this.localIndex + 1 === this.blocksLength) return;

    this.setActive.next(this.localIndex + 1);
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
    const lineBreakRegExp = new RegExp(/\r\n|\r|\n/gm);

    return text.split(lineBreakRegExp).length;
  }

  private renderComponentForEditMode(): void {
    const component = this.editorBlocksRegistry[this.textBlock.type];
    this.componentRef = this.editComponent.createComponent<BasicBlockComponent>(component);
    this.componentRef.instance.text = this.textBlock.text;
    this.componentRef.changeDetectorRef.detectChanges();
  }
}
