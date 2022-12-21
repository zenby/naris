import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor/editor.component';
import { BlockEditorComponent } from './block-editor/block-editor.component';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { TextareaAutoresizeDirective } from './textarea-autoresize.directive';
import { TestBlockComponent } from './blocks/test-block/test-block.component';
import { TypeFormatPipe } from './pipes/type-format.pipe';
import { BooleanToStringPipe } from './pipes/boolean-to-string.pipe';
import { BlockService } from './block.service';
import { CodeBlockComponent } from './blocks/code-block/code-block.component';
import { MarkdownBlockComponent } from './blocks/markdown-block/markdown-block.component';

@NgModule({
  imports: [CommonModule, MarkdownModule.forRoot(), FormsModule],
  declarations: [
    BlockEditorComponent,
    BooleanToStringPipe,
    CodeBlockComponent,
    EditorComponent,
    MarkdownBlockComponent,
    TestBlockComponent,
    TextareaAutoresizeDirective,
    TypeFormatPipe,
  ],
  providers: [BlockService],
  exports: [EditorComponent],
})
export class SrEditorModule {}
