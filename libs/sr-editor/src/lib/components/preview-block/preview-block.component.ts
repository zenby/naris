import { Component, ComponentRef, Inject, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { BasicBlockComponent } from '../basic-block.component';
import { TextBlock, TextBlockType } from '../../interfaces/document.model';
import { EditorBlocksRegistry, EDITOR_BLOCKS_REGISTRY_TOKEN } from '../../editor-blocks-config';

@Component({
  selector: 'soer-preview-block',
  templateUrl: './preview-block.component.html',
})
export class PreviewBlockComponent {
  _block: TextBlock = { type: 'markdown', text: '' };
  @Input() set block(value: TextBlock) {
    this._block = value;
    this.renderBlock();
  }
  @Input() set type(value: TextBlockType) {
    this._block.type = value;
    this.renderBlock();
  }
  @Input() set text(value: string) {
    this._block.text = value;
    this.renderBlock();
  }

  @ViewChild('blockComponent', { static: true, read: ViewContainerRef }) blockComponent!: ViewContainerRef;

  componentRef: ComponentRef<BasicBlockComponent> | null = null;

  constructor(@Inject(EDITOR_BLOCKS_REGISTRY_TOKEN) public editorBlocksRegistry: EditorBlocksRegistry) {}

  private renderBlock(): void {
    const component = this.editorBlocksRegistry[this._block.type];
    this.componentRef?.destroy();
    this.componentRef = this.blockComponent.createComponent<BasicBlockComponent>(component);
    this.componentRef.instance.text = this._block.text;
    this.componentRef.changeDetectorRef.detectChanges();
  }
}
