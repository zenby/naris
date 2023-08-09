import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { ListTargetsPageComponent } from './list-targets-page/list-targets-page.component';
import { ListTemplatesPageComponent } from './list-templates-page/list-templates-page.component';

import { TargetEditFormComponent } from './target-edit-form/target-edit-form.component';
import { TaskEditFormComponent } from './task-edit-form/task-edit-form.component';
import { ListAimsPageComponent } from './list-aims-page/list-aims-page.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { TaskTreeEditFormComponent } from './task-tree-edit-form/task-tree-edit-form.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { CalcProgressPipe } from './calc-progress.pipe';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CountOpenTasksPipe } from './count-open-tasks.pipe';
import { CountClosedTasksPipe } from './count-closed-tasks.pipe';
import { SrDTOModule } from '@soer/sr-dto';
import { TemplateCreateComponent } from './template-create/template-create.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { TargetDescriptionFormComponent } from './target-description-form/target-description-form.component';
import { TargetDescriptionPopupComponent } from './target-description-popup/target-description-popup.component';
import { TargetAchievedSubscriber } from '../../../api/progress/subscribers/target-achieved.subscriber';

import { AimsTreeModule, InlineEditorModule, TileModule } from '@soer/soer-components';
import { SrEditorModule } from '@soer/sr-editor';
import { MarkdownModule } from 'ngx-markdown';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { TaskClosedSubscriber } from '../../../api/progress/subscribers/task-closed.subscriber';
import { LinksModule } from '../links/links.module';

const SOER_COMPONENTS_MODULES = [TileModule];

@NgModule({
  declarations: [
    TargetEditFormComponent,
    TargetDescriptionPopupComponent,
    ListTemplatesPageComponent,
    ListTargetsPageComponent,
    TaskEditFormComponent,
    ListAimsPageComponent,
    TaskTreeEditFormComponent,
    CalcProgressPipe,
    CountOpenTasksPipe,
    CountClosedTasksPipe,
    TemplateCreateComponent,
    TargetDescriptionFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzDescriptionsModule,
    NzTimelineModule,
    NzProgressModule,
    NzBadgeModule,
    NzButtonModule,
    NzResultModule,
    NzIconModule,
    NzInputModule,
    NzTabsModule,
    NzCardModule,
    NzPopconfirmModule,
    NzStepsModule,
    NzDividerModule,
    NzCheckboxModule,
    NzSpaceModule,
    NzTypographyModule,
    NzBreadCrumbModule,
    NzNotificationModule,
    NzCollapseModule,
    NzSwitchModule,
    NzListModule,
    NzEmptyModule,
    RouterModule,
    SrDTOModule,
    InlineEditorModule,
    SrEditorModule,
    AimsTreeModule,
    MarkdownModule.forRoot(),
    NzSpinModule,
    LinksModule,
    ...SOER_COMPONENTS_MODULES,
  ],
  exports: [],
  providers: [],
})
export class TargetsModule {
  constructor(
    private targetAchievedSubscriber: TargetAchievedSubscriber,
    private taskClosedSubscriber: TaskClosedSubscriber
  ) {}
}
