import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorBlocksRegistry, EDITOR_BLOCKS_REGISTRY_TOKEN } from '@soer/sr-editor';
import {
  CodeBlockComponent,
  MarkdownBlockComponent,
  SrCodeBlockModule,
  SrMarkdownBlockModule,
  SrTestBlockModule,
  TestBlockComponent,
} from '@soer/sr-editor-blocks';

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
export class EditorBlocksModule {}
