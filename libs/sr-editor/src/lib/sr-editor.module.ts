import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { BlockEditorComponent } from './block-editor/block-editor.component';
import { CodeBlockComponent } from './blocks/code-block/code-block.component';
import { MarkdownBlockComponent } from './blocks/markdown-block/markdown-block.component';
import { TestBlockComponent } from './blocks/test-block/test-block.component';
import { EditorComponent } from './editor/editor.component';
import { BooleanToStringPipe } from './pipes/boolean-to-string.pipe';
import { TypeFormatPipe } from './pipes/type-format.pipe';
import { BlockService } from './services/block.service';
import { CodeBlockService } from './services/code-block.service';
import { TextareaAutoresizeDirective } from './textarea-autoresize.directive';

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
  providers: [BlockService, CodeBlockService],
  exports: [EditorComponent],
})
export class SrEditorModule {}
