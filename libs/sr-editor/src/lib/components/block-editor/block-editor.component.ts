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

@Component({
  selector: 'soer-block-editor',
  templateUrl: './block-editor.component.html',
  styleUrls: ['./block-editor.component.scss'],
})
export class BlockEditorComponent implements AfterViewInit {
  @Input() textBlock: TextBlock = { type: 'markdown', text: '' };

  @ViewChild('edit') set editRef(ref: ElementRef) {
    if (ref) {
      ref.nativeElement.focus();
    }
  }

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

  ngOnChanges(): void {
    if (this.isActive && this.isEdit) {
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
    if (event.altKey && event.code === 'Enter') {
      this.addBlock.next(this.localIndex);
    }

    if (event.altKey && event.code === 'Backspace') {
      this.removeBlock.next(this.localIndex);
    }

    if (event.altKey && event.code === 'ArrowUp') {
      this.moveUp.next(this.localIndex);

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
      this.moveDown.next(this.localIndex);

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
