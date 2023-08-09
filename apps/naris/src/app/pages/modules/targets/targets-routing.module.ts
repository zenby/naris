import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComposeOnePageComponent } from '../../router-compose/compose-one-page/compose-one-page.component';
import { ComposeTabPageComponent } from '../../router-compose/compose-tab-page/compose-tab-page.component';
import { ListAimsPageComponent } from './list-aims-page/list-aims-page.component';
import { ListTargetsPageComponent } from './list-targets-page/list-targets-page.component';
import { ListTemplatesPageComponent } from './list-templates-page/list-templates-page.component';
import { TargetEditFormComponent } from './target-edit-form/target-edit-form.component';
import { TaskEditFormComponent } from './task-edit-form/task-edit-form.component';
import { TemplateCreateComponent } from './template-create/template-create.component';
import { TargetDescriptionPopupComponent } from './target-description-popup/target-description-popup.component';
import { VideoViewPageComponent } from '../links/video-view-page/video-view-page.component';

const routes: Routes = [
  {
    path: 'targets',
    component: ComposeTabPageComponent,
    data: { header: { title: 'Достижение целей', subtitle: 'помощь в саморазвитии' } },
    children: [
      {
        path: '',
        data: {
          header: { title: 'Сегодня', subtitle: 'текущие задачи' },
          controls: [{ title: 'Добавить', path: ['.', { outlets: { popup: ['target', 'new'] } }], icon: 'plus' }],
        },
        component: ListAimsPageComponent,
        resolve: {
          targets: 'targetsEmitter',
        },
      },
      {
        path: 'filter/:tid',
        data: { header: { title: 'Сегодня', subtitle: 'текущие задачи', cantBeTab: true } },
        component: ListTargetsPageComponent,
        resolve: {
          targets: 'targetEmitter',
        },
      },
      {
        path: 'list',
        data: {
          header: { title: 'Цели', subtitle: 'Установите новые цели' },
          controls: [{ title: 'Добавить', path: ['../', { outlets: { popup: ['target', 'new'] } }], icon: 'plus' }],
        },
        component: ListTargetsPageComponent,
        resolve: {
          targets: 'targetsEmitter',
        },
      },
      {
        path: 'templates/private',
        data: {
          header: { title: 'Мои шаблоны', subtitle: 'Личные шаблоны' },
          isEditable: true,
          afterCommandDoneRedirectTo: [{ outlets: { primary: ['list'] } }],
        },
        component: ListTemplatesPageComponent,
        resolve: {
          templates: 'templatesEmitter',
        },
      },
      {
        path: 'templates/public',
        data: {
          header: { title: 'Общие шаблоны', subtitle: 'Шаблоны созданные сообществом' },
          isEditable: false,
          afterCommandDoneRedirectTo: [{ outlets: { primary: ['list'] } }],
        },
        component: ListTemplatesPageComponent,
        resolve: {
          templates: 'publicTemplatesEmitter',
        },
      },
      {
        path: 'target/new',
        component: TargetEditFormComponent,
        outlet: 'popup',
        data: {
          afterCommandDoneRedirectTo: [{ outlets: { popup: ['target', 'edit', ':id'] } }],
        },
      },
      {
        path: 'target/edit/:tid',
        component: TaskEditFormComponent,
        resolve: {
          target: 'targetEmitter',
        },
        outlet: 'popup',
      },
      {
        path: 'target/:tid/description/:path',
        component: TargetDescriptionPopupComponent,
        resolve: {
          target: 'targetEmitter',
        },
        outlet: 'popup',
      },
      {
        path: 'link/:did/video',
        component: VideoViewPageComponent,
        resolve: {
          link: 'jsonDocumentEmitter',
        },
        outlet: 'popup',
      },
      {
        path: 'target/:tid/template/create',
        component: TemplateCreateComponent,
        resolve: {
          target: 'targetEmitter',
        },
        outlet: 'popup',
      },
    ],
  },
  {
    path: 'targets/edit/:tid',
    component: ComposeOnePageComponent,
    children: [
      {
        path: '',
        component: TaskEditFormComponent,
        resolve: {
          target: 'targetEmitter',
        },
      },
    ],
  },
  {
    path: 'targets/new',
    component: ComposeOnePageComponent,
    children: [
      {
        path: '',
        component: TargetEditFormComponent,
        resolve: {
          target: 'targetEmitter',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TargetsRoutingModule {}
