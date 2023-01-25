import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeRunnerModule } from '@soer/sr-code-runner';
import { CodeBlockComponent } from './code-block.component';

@NgModule({
  imports: [CommonModule, CodeRunnerModule],
  declarations: [CodeBlockComponent],
  exports: [CodeBlockComponent],
})
export class SrCodeBlockModule {}
