import {
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
  @Input() blockDelimeter: string | undefined;

  @Output() addBlock = new EventEmitter<number>();
  @Output() removeBlock = new EventEmitter<number>();
  @Output() endEdit = new EventEmitter<number>();
  @Output() moveUp = new EventEmitter<number>();
  @Output() moveDown = new EventEmitter<number>();
  @Output() setActive = new EventEmitter<number>();
  @Output() markdownTextChange = new EventEmitter<string>();

  @ViewChild('editComponent', { static: true, read: ViewContainerRef }) editComponent!: ViewContainerRef;

  componentRef: ComponentRef<BasicBlockComponent> | null = null;

  constructor(@Inject(EDITOR_BLOCKS_REGISTRY_TOKEN) public editorBlocksRegistry: EditorBlocksRegistry) {}

  ngAfterViewInit(): void {
    this.renderComponentForEditMode();
  }

  onSelectBlock(): void {
    this.setActive.next(this.localIndex);
  }

  textChange(changedText: string) {
    this.markdownTextChange.emit(changedText);
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

    if ($event.altKey && $event.code === 'Digit3') {
      this.textBlock.type = 'code';
    }

    if ($event.code === 'Escape') {
      this.isEdit = false;
    }
  }

  onEndEdit(): void {
    this.isEdit = false;
    this.endEdit.next(this.localIndex);
    if (this.componentRef) {
      this.componentRef.instance.text = this.textBlock.text;
    }
  }

  private renderComponentForEditMode(): void {
    const component = this.editorBlocksRegistry[this.textBlock.type];
    this.componentRef = this.editComponent.createComponent<BasicBlockComponent>(component);
    this.componentRef.instance.text = this.textBlock.text;
    this.componentRef.changeDetectorRef.detectChanges();
  }
}
