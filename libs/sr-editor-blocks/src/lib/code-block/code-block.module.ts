import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeBlockComponent } from './code-block.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CodeBlockComponent],
  exports: [CodeBlockComponent],
})
export class SrCodeBlockModule {}
