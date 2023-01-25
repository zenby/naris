import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownBlockComponent, SrMarkdownBlockModule } from '@soer/sr-markdown-block';
import { SrTestBlockModule, TestBlockComponent } from '@soer/sr-test-block';
import { CodeBlockComponent, SrCodeBlockModule } from '@soer/sr-code-block';
import { EditorBlocksRegistry, EDITOR_BLOCKS_REGISTRY_TOKEN } from '@soer/sr-editor';

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
