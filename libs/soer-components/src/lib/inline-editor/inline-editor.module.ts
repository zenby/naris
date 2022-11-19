import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineEditorComponent } from './inline-editor/inline-editor.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [InlineEditorComponent],
  imports: [
    CommonModule,
    NzIconModule,
    NzButtonModule,
  ],
  exports: [InlineEditorComponent]
})
export class InlineEditorModule {}
