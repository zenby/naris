import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeBlockComponent } from './code-block/code-block.component';
import { MarkdownBlockComponent } from './markdown-block/markdown-block.component';
import { TestBlockComponent } from './test-block/test-block.component';
import { SrCodeBlockModule } from './code-block/code-block.module';
import { SrMarkdownBlockModule } from './markdown-block/markdown-block.module';
import { SrTestBlockModule } from './test-block/test-block.module';
import { EditorBlocksRegistry } from './editor-blocks.model';

export const EDITOR_BLOCKS_REGISTRY_TOKEN = Symbol('EDITOR_BLOCKS_REGISTRY_TOKEN');

const editorBlocksRegistry: EditorBlocksRegistry = {
  markdown: MarkdownBlockComponent,
  presentation: MarkdownBlockComponent,
  test: TestBlockComponent,
  code: CodeBlockComponent,
};

@NgModule({
  imports: [CommonModule, SrCodeBlockModule, SrMarkdownBlockModule, SrTestBlockModule],
  exports: [CodeBlockComponent, MarkdownBlockComponent, TestBlockComponent],
  providers: [
    {
      provide: EDITOR_BLOCKS_REGISTRY_TOKEN,
      useValue: editorBlocksRegistry,
    },
  ],
})
export class SrEditorBlocksModule {}
