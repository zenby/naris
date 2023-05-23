import { HttpClientModule } from '@angular/common/http';
import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FilesListComponent } from './files-list.component';
import { NzMessageService } from 'ng-zorro-antd/message';
// @ts-ignore
import { OverlayModule } from '@angular/cdk/overlay';
import { AccessDeniedModule } from '../access-denied/access-denied.module';
import { RouterTestingModule } from '@angular/router/testing';

export default {
  title: 'FilesListComponent',
  component: FilesListComponent,
  decorators: [
    moduleMetadata({
      imports: [
        RouterTestingModule,
        NzCardModule,
        NzTagModule,
        NzGridModule,
        NzIconModule,
        HttpClientModule,
        OverlayModule,
        AccessDeniedModule,
      ],
      providers: [NzMessageService],
    }),
  ],
} as Meta<FilesListComponent>;

export const Primary: StoryFn = () => ({
  props: {
    webFiles: [
      {
        title: 'xDonate',
        labels: ['v0.2.0'],
        url: 'xdonate.zip',
        desc: 'Система донатов для персонального использования',
        level: 'workshop',
        icon: 'lock',
      },
      {
        title: 'SOER PRO',
        labels: ['github', 'Frontend'],
        url: 'https://github.com/soerdev/soer',
        desc: 'Фронтенд часть проекта SOER PRO ',
        level: 'public',
        icon: 'github',
      },
      {
        title: 'SOER PRO',
        labels: ['v1.8.0', 'Backend'],
        url: 'soerback.zip',
        desc: 'Бекенд часть проекта SOER PRO',
        level: 'pro',
        icon: 'lock',
      },
    ],
  },
});
