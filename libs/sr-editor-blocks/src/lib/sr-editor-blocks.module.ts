import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeBlockComponent } from './code-block/code-block.component';
import { MarkdownBlockComponent } from './markdown-block/markdown-block.component';
import { TestBlockComponent } from './test-block/test-block.component';
import { SrCodeBlockModule } from './code-block/code-block.module';
import { SrMarkdownBlockModule } from './markdown-block/markdown-block.module';
import { SrTestBlockModule } from './test-block/test-block.module';

@NgModule({
  imports: [CommonModule, SrCodeBlockModule, SrMarkdownBlockModule, SrTestBlockModule],
  exports: [CodeBlockComponent, MarkdownBlockComponent, TestBlockComponent],
})
export class SrEditorBlocksModule {}
