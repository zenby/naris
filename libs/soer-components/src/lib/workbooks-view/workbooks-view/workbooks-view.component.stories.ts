import { WorkbooksViewComponent } from './workbooks-view.component';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { WorkbookModel } from '@soer/sr-editor';
import { NzCardModule } from 'ng-zorro-antd/card';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { DemoNgZorroAntdModule } from '../../demo-ng-zorro-antd/demo-ng-zorro-antd.module';
import { HttpClientModule } from '@angular/common/http';
import { faker } from '@faker-js/faker';

export default {
  title: 'WorkbooksViewComponent',
  component: WorkbooksViewComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Компонент для просмотра воркбуков и возможности работы с выбранным воркбуком.' +
          ' Принимает на вход массив воркбуков.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        CommonModule,
        NzCardModule,
        NzPopconfirmModule,
        NzIconModule,
        NzButtonModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        DemoNgZorroAntdModule,
        HttpClientModule,
      ],
    }),
  ],
} as Meta<WorkbooksViewComponent>;

const veryLongTitle = faker.random.words(150);
const titleWithLongWord = faker.random.words(150).replace(/\s+/g, '');

const workbooks: WorkbookModel[] = [
  { question: 'Сортируем нули и единицы', id: 123, blocks: [] },
  { question: 'Что общего у пингвина и окна', id: 456, blocks: [] },
  { question: 'Как пропатчить KDE2 под FreeBSD', id: 789, blocks: [] },
  { question: 'Заголовок меньше 30 символов', id: 912, blocks: [] },
  { question: veryLongTitle, id: 234, blocks: [] },
  { question: titleWithLongWord, id: 567, blocks: [] },
];

export const Default: StoryFn = () => ({
  props: {
    workbooks,
  },
});

export const Empty: StoryFn = () => ({});
