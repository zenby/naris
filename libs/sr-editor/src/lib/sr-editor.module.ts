import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MarkdownModule } from 'ngx-markdown';
import { BlockEditorComponent } from './block-editor/block-editor.component';
import { EditorComponent } from './editor/editor.component';
import { BooleanToStringPipe } from './pipes/boolean-to-string.pipe';
import { TypeFormatPipe } from './pipes/type-format.pipe';
import { BlockService } from './services/block.service';
import { TextareaAutoresizeDirective } from './textarea-autoresize.directive';
import { SrEditorBlocksModule } from '@soer/sr-editor-blocks';

@NgModule({
  imports: [CommonModule, MarkdownModule.forRoot(), FormsModule, SrEditorBlocksModule],
  declarations: [
    BlockEditorComponent,
    BooleanToStringPipe,
    EditorComponent,
    TextareaAutoresizeDirective,
    TypeFormatPipe,
  ],
  providers: [BlockService],
  exports: [EditorComponent],
})
export class SrEditorModule {}
