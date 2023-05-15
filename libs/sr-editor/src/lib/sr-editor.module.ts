import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MarkdownModule } from 'ngx-markdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { BlockEditorComponent } from './components/block-editor/block-editor.component';
import { BlockEditorControlsComponent } from './components/block-editor-controls/block-editor-controls.component';
import { EditorComponent } from './components/editor/editor.component';
import { BooleanToStringPipe } from './pipes/boolean-to-string.pipe';
import { TypeFormatPipe } from './pipes/type-format.pipe';
import { BlockService } from './services/block.service';
import { TextareaAutoresizeDirective } from './textarea-autoresize.directive';
import { PreviewBlockComponent } from './components/preview-block/preview-block.component';

@NgModule({
  imports: [CommonModule, MarkdownModule.forRoot(), FormsModule, NzIconModule, NzButtonModule, NzToolTipModule],
  declarations: [
    BlockEditorComponent,
    BlockEditorControlsComponent,
    PreviewBlockComponent,
    BooleanToStringPipe,
    EditorComponent,
    TextareaAutoresizeDirective,
    TypeFormatPipe,
  ],
  providers: [BlockService],
  exports: [EditorComponent, PreviewBlockComponent],
})
export class SrEditorModule {}
