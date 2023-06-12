import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { InfoComponent } from './info.component';
import { DemoNgZorroAntdModule } from '@soer/soer-components';
import { RouterTestingModule } from '@angular/router/testing';

export default {
  title: 'InfoComponent',
  component: InfoComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule, DemoNgZorroAntdModule, HttpClientModule],
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
                      url: 'https://vk.com/soerdevs',
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

export const Primary: StoryFn = () => ({});
