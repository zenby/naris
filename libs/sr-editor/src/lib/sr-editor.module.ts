import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor/editor.component';
import { BlockEditorComponent } from './blocks/block-editor/block-editor.component';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { TextareaAutoresizeDirective } from './textarea-autoresize.directive';
import { BlockTestComponent } from './blocks/block-test/block-test.component';
import { TypeFormatPipe } from './pipes/type-format.pipe';
import { BooleanToStringPipe } from './pipes/boolean-to-string.pipe';
import { BlockService } from './block.service';
import { CodeBlockComponent } from './blocks/code-block/code-block.component';

@NgModule({
  imports: [CommonModule, MarkdownModule.forRoot(), FormsModule],
  declarations: [
    EditorComponent,
    BlockEditorComponent,
    TextareaAutoresizeDirective,
    BlockTestComponent,
    TypeFormatPipe,
    BooleanToStringPipe,
    CodeBlockComponent,
  ],
  providers: [BlockService],
  exports: [EditorComponent],
})
export class SrEditorModule {}
