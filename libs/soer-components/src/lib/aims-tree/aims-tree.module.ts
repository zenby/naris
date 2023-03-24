import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { InlineEditorModule } from '../inline-editor/inline-editor.module';
import { TodoModule } from '../todo';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { AimRawComponent } from './aim-raw/aim-raw.component';
import { AimsTreeComponent } from './aims-tree/aims-tree.component';
import { TargetService } from './target.service';
import { TargetComponent } from './target/target.component';

@NgModule({
  declarations: [AimsTreeComponent, AimRawComponent, TargetComponent],
  imports: [
    CommonModule,
    RouterModule,
    TodoModule,
    ToolbarModule,
    NzProgressModule,
    NzIconModule,
    NzButtonModule,
    NzCardModule,
    NzGridModule,
    NzGridModule,
    NzTypographyModule,
    NzPopconfirmModule,
    InlineEditorModule,
  ],
  providers: [TargetService],
  exports: [AimsTreeComponent, TargetComponent],
})
export class AimsTreeModule {}
