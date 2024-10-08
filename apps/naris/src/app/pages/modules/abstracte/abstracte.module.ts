import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PreloaderModule } from '@soer/soer-components';
import { SrDTOModule } from '@soer/sr-dto';
import { SrEditorModule } from '@soer/sr-editor';
import { SrDiagramBlockModule } from '@soer/sr-editor-blocks';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { MarkdownModule } from 'ngx-markdown';
import { EditAbstracteFormComponent } from './edit-abstracte-form/edit-abstracte-form.component';
import { EditAbstractePageComponent } from './edit-abstracte-page/edit-abstracte-page.component';
import { ListAbstractePageComponent } from './list-abstracte-page/list-abstracte-page.component';
import { ViewAbstractePageComponent } from './view-abstracte-page/view-abstracte-page.component';
import { WorkbooksViewModule } from '@soer/soer-components';
import { ConfirmPageLeaveGuard } from '../../../guards/confirm-page-leave.guard';
import { JsonSettingsModule } from '../json-settings/json-settings.module';

@NgModule({
  declarations: [
    ListAbstractePageComponent,
    EditAbstractePageComponent,
    ViewAbstractePageComponent,
    EditAbstracteFormComponent,
  ],
  exports: [ViewAbstractePageComponent],
  providers: [ConfirmPageLeaveGuard],
  imports: [
    PreloaderModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDescriptionsModule,
    NzTimelineModule,
    NzProgressModule,
    NzBadgeModule,
    NzButtonModule,
    NzResultModule,
    NzIconModule,
    NzInputModule,
    NzCardModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzPopconfirmModule,
    RouterModule,
    MarkdownModule.forRoot(),
    SrDTOModule,
    SrEditorModule,
    SrDiagramBlockModule,
    WorkbooksViewModule,
    JsonSettingsModule,
  ],
})
export class AbstracteModule {}
