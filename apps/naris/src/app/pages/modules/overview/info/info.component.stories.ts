import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DemoNgZorroAntdModule } from '../../../demo.module';
import { InfoComponent } from './info.component';

export default {
  title: 'InfoComponent',
  component: InfoComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterModule.forRoot([], { useHash: true }), DemoNgZorroAntdModule, HttpClientModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                brif: {
                  contacts: [
                    {
                      icon: 'mail',
                      title: 'Помощь',
                      text: 'По всем вопросам работы сайта обращаться soersoft@gmail.com',
                      url: 'mailto:soersoft@gmail.com',
                    },

                    {
                      icon: 'lock',
                      title: 'Чат участников',
                      text: "Закрытый чат в Telegram на уровнях 'STREAM', 'WORKSHOP', 'PRO'",
                      url: '#!/pages/pay',
                    },
                  ],
                  social: [
                    {
                      icon: 'youtube',
                      title: 'YouTube',
                      text: 'Теория, уроки, интервью и многое другое.',
                      url: 'https://www.youtube.com/c/S0ERDEVS',
                    },

                    {
                      icon: 'coffee',
                      title: 'Telegram',
                      text: 'Сообщество для всех интересующихся программированием',
                      url: 'https://t.me/softwareengineervlog',
                    },

                    {
                      icon: 'team',
                      title: 'VK',
                      text: 'Сообщество с уроками по программированию',
                      url: 'https://vk.com/codeartblog',
                    },
                  ],
                },
              },
            },
          },
        },
      ],
    }),
  ],
} as Meta<InfoComponent>;

const Template: Story<InfoComponent> = (args: InfoComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
