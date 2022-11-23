import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AudioPlayerModule } from '@soer/soer-components';
import { DataStoreService } from '@soer/sr-dto';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { QuestionsConfigService } from '../services/questions-config.service';
import { QuestionViewComponent } from './question-view.component';

const activatedRouteMock =  {
  snapshot: {
    data: { question: null },
  },
}

const dataStoreServiceMock = {
  of: () =>
    of({
      payload: {
        items: [
          {
            id: 2,
            question:
              'Здравствуйте SOER, хотел бы попросить у вас ссылку на космический трек для тестирования аудиокомпонента, спасибо!',
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            createdAt: '2021-09-05T19:53:18.000Z',
            updatedAt: '2021-09-05T19:53:18.000Z',
          },
        ],
      },
    }),
}

export default {
  title: 'QuestionViewComponent',
  component: QuestionViewComponent,
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule, AudioPlayerModule],
      providers: [
        QuestionsConfigService,
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
        {
          provide: DataStoreService,
          useValue: dataStoreServiceMock
        },
      ],
    }),
  ],
} as Meta<QuestionViewComponent>;

const Template: Story<QuestionViewComponent> = (
  args: QuestionViewComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
