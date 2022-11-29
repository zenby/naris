import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DemoNgZorroAntdModule } from '../../demo.module';
import { FilesListComponent } from './files-list.component';

export default {
  title: 'FilesListComponent',
  component: FilesListComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterModule.forRoot([], { useHash: true }), DemoNgZorroAntdModule, HttpClientModule],
      providers: [
        {
          provide: APP_BASE_HREF,
          useValue: '/',
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                webfiles: [
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
            },
          },
        },
      ],
    }),
  ],
} as Meta<FilesListComponent>;

const Template: Story<FilesListComponent> = (args: FilesListComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
