import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { TestBlockComponent } from './test-block.component';

@NgModule({
  imports: [CommonModule, MarkdownModule.forRoot()],
  declarations: [TestBlockComponent],
  exports: [TestBlockComponent],
})
export class SrTestBlockModule {}
