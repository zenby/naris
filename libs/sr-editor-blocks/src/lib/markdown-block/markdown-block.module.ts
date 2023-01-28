import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { MarkdownBlockComponent } from './markdown-block.component';

@NgModule({
  imports: [CommonModule, MarkdownModule.forRoot()],
  declarations: [MarkdownBlockComponent],
  exports: [MarkdownBlockComponent],
})
export class SrMarkdownBlockModule {}
