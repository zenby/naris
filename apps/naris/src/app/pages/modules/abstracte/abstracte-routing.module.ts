import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingChangesGuard } from '../../../guards/pending-changes-guard.guard';
import { ComposeIcontabsPageComponent } from '../../router-compose/compose-icontabs-page/compose-icontabs-page.component';
import { WORKBOOK_TAG } from './abstracte.const';
import { EditAbstractePageComponent } from './edit-abstracte-page/edit-abstracte-page.component';
import { ListAbstractePageComponent } from './list-abstracte-page/list-abstracte-page.component';
import { ViewAbstractePageComponent } from './view-abstracte-page/view-abstracte-page.component';

const routes: Routes = [
  {
    path: WORKBOOK_TAG,
    component: ComposeIcontabsPageComponent,
    children: [
      {
        path: '',
        redirectTo: 'conspects',
        pathMatch: 'full',
      },
      {
        path: 'conspects',
        data: {
          header: { title: 'Конспекты', iconText: 'Конспекты' },
          controls: [{ title: 'Добавить', path: ['create', 'new'], icon: 'plus' }],
          page: {
            title: 'Создайте свой первый конспект',
            info: 'Для закрепления материала важно не только смотреть видео и читать книги, но и пытаться выделить главное.',
          },
        },
        resolve: {
          workbooks: 'workbooksEmitter',
        },
        children: [
          { path: '', component: ListAbstractePageComponent },
          {
            path: 'create/:wid',
            component: EditAbstractePageComponent,
            data: {
              header: {
                title: 'Новый конспект',
                subtitle: 'помощь в осмыслении материалов по программированию',
              },
              controls: [
                {
                  title: 'Просмотр',
                  path: ['.'],
                  toggle: 'preview',
                  icon: 'eye/eye-invisible',
                },
                {
                  title: 'Сохранить',
                  path: ['.'],
                  action: 'save',
                  icon: 'save',
                },
                { title: 'Назад', path: ['../..'], icon: 'rollback' },
              ],
            },
            resolve: {
              workbook: 'workbookEmitter',
            },
            canDeactivate: [PendingChangesGuard],
          },
          {
            path: 'edit/:wid',
            component: EditAbstractePageComponent,
            data: {
              header: {
                title: 'Изменить конспект',
                subtitle: 'помощь в осмыслении материалов по программированию',
              },
              controls: [
                {
                  title: 'Просмотр',
                  path: ['.'],
                  toggle: 'preview',
                  icon: 'eye/eye-invisible',
                },
                {
                  title: 'Сохранить',
                  path: ['.'],
                  action: 'save',
                  icon: 'save',
                },
                { title: 'Назад', path: ['../..'], icon: 'rollback' },
              ],
            },
            resolve: {
              workbook: 'workbookEmitter',
            },
            canDeactivate: [PendingChangesGuard],
          },
          {
            path: 'view/:wid',
            component: ViewAbstractePageComponent,
            data: {
              header: {
                title: 'Конспект',
                subtitle: 'помощь в осмыслении материалов по программированию',
              },
              controls: [
                {
                  title: 'Сохранить в PDF',
                  path: ['.'],
                  action: 'save-as-pdf',
                  icon: 'file-pdf',
                },
                { title: 'Назад', path: ['../..'], icon: 'rollback' },
              ],
            },
            resolve: {
              workbook: 'workbookEmitter',
            },
          },
        ],
      },
      {
        path: 'quiz',
        data: {
          header: { title: 'Тесты и опросы', iconText: 'Тесты' },
          controls: [{ title: 'Добавить', path: ['create', 'new'], icon: 'plus' }],
          page: {
            title: 'Создайте свой первый тест',
            info: 'Создайте тест, который поможет вам, или вашим коллегам, проверить свои знания',
          },
        },
        resolve: {
          workbooks: 'quizsEmitter',
        },
        children: [
          { path: '', component: ListAbstractePageComponent },
          {
            path: 'create/:wid',
            component: EditAbstractePageComponent,
            data: {
              header: {
                title: 'Новый тест',
                subtitle: 'проверка знаний, полученных в ходе образовательного процесса',
              },
              controls: [
                {
                  title: 'Просмотр',
                  path: ['.'],
                  toggle: 'preview',
                  icon: 'eye/eye-invisible',
                },
                {
                  title: 'Сохранить',
                  path: ['.'],
                  action: 'save',
                  icon: 'save',
                },
                { title: 'Назад', path: ['../..'], icon: 'rollback' },
              ],
            },
            resolve: {
              workbook: 'quizEmitter',
            },
          },
          {
            path: 'edit/:wid',
            component: EditAbstractePageComponent,
            data: {
              header: {
                title: 'Изменить тест',
                subtitle: 'проверка знаний, полученных в ходе образовательного процесса',
              },
              controls: [
                {
                  title: 'Просмотр',
                  path: ['.'],
                  toggle: 'preview',
                  icon: 'eye/eye-invisible',
                },
                {
                  title: 'Сохранить',
                  path: ['.'],
                  action: 'save',
                  icon: 'save',
                },
                { title: 'Назад', path: ['../..'], icon: 'rollback' },
              ],
            },
            resolve: {
              workbook: 'quizEmitter',
            },
          },
          {
            path: 'view/:wid',
            component: ViewAbstractePageComponent,
            data: {
              header: {
                title: 'Тест',
                subtitle: 'проверка знаний, полученных в ходе образовательного процесса',
              },
              controls: [
                {
                  title: 'Сохранить в PDF',
                  path: ['.'],
                  action: 'save-as-pdf',
                  icon: 'file-pdf',
                },
                { title: 'Назад', path: ['../..'], icon: 'rollback' },
              ],
            },
            resolve: {
              workbook: 'quizEmitter',
            },
          },
        ],
      },
      {
        path: 'articles',
        data: {
          header: { title: 'Статьи', iconText: 'Статьи' },
          controls: [{ title: 'Добавить', path: ['create', 'new'], icon: 'plus' }],
          page: {
            title: 'Напишите свою первую статью',
            info: 'Напишите статью и поделитесь своими знаниями',
          },
        },
        resolve: {
          workbooks: 'articlesEmitter',
        },
        children: [
          { path: '', component: ListAbstractePageComponent },
          {
            path: 'create/:wid',
            component: EditAbstractePageComponent,
            data: {
              header: {
                title: 'Новая статья',
                subtitle: 'расскажите о своем опыте',
              },
              controls: [
                {
                  title: 'Просмотр',
                  path: ['.'],
                  toggle: 'preview',
                  icon: 'eye/eye-invisible',
                },
                {
                  title: 'Сохранить',
                  path: ['.'],
                  action: 'save',
                  icon: 'save',
                },
                { title: 'Назад', path: ['../..'], icon: 'rollback' },
              ],
            },
            resolve: {
              workbook: 'articleEmitter',
            },
          },
          {
            path: 'edit/:wid',
            component: EditAbstractePageComponent,
            data: {
              header: {
                title: 'Изменить статью',
                subtitle: 'расскажите о своем опыте',
              },
              controls: [
                {
                  title: 'Просмотр',
                  path: ['.'],
                  toggle: 'preview',
                  icon: 'eye/eye-invisible',
                },
                {
                  title: 'Сохранить',
                  path: ['.'],
                  action: 'save',
                  icon: 'save',
                },
                { title: 'Назад', path: ['../..'], icon: 'rollback' },
              ],
            },
            resolve: {
              workbook: 'articleEmitter',
            },
          },
          {
            path: 'view/:wid',
            component: ViewAbstractePageComponent,
            data: {
              header: {
                title: 'Статья',
                subtitle: 'расскажите о своем опыте',
              },
              controls: [
                {
                  title: 'Сохранить в PDF',
                  path: ['.'],
                  action: 'save-as-pdf',
                  icon: 'file-pdf',
                },
                { title: 'Назад', path: ['../..'], icon: 'rollback' },
              ],
            },
            resolve: {
              workbook: 'articleEmitter',
            },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbstracteRoutingModule {}
