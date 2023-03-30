import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DemoNgZorroAntdModule, TileModule } from '@soer/soer-components';
import { DataStoreService } from '@soer/sr-dto';
import { Meta, moduleMetadata, Story, StoryFn } from '@storybook/angular';
import { of } from 'rxjs';
import { PersonalActivityService } from '../../../../api/progress/personal-activity.service';
import { MetricsListComponent } from './metrics-list/metrics-list.component';
import { CountStatusStrategyPipe } from './metrics-list/strategies/count-status-strategy.pipe';
import { PercentStatusStrategyPipe } from './metrics-list/strategies/percent-status-strategy.pipe';
import { MetricsComponent } from './metrics.component';
import { TargetsListComponent } from './targets-list/targets-list.component';

const activatedRouteMock = {
  snapshot: {
    data: {
      header: {
        title: 'Метрики',
        subtitle: 'отражают ваши достижения и цели',
        icon: 'pie-chart',
      },
      workbooks: {
        schema: {
          url: 'v2/json/workbook/:wid',
        },
        key: {
          wid: 'personal',
        },
      },
      targets: {
        schema: {
          url: 'v2/json/targets/:tid',
        },
        key: {
          tid: 'personal',
        },
      },
      questions: {
        schema: {
          url: 'questions/:qid',
        },
        key: {
          qid: '',
        },
      },
      streams: [
        {
          title: '2020',
          children: [
            {
              thumb_url:
                'https://kinescopecdn.net/ddf53242-63ff-480d-9004-4a8cc9345a55/posters/193d8a64-81a9-4b63-84f2-6776f1db7f5c/md/a3c92559-57c6-408d-bbb6-8cbbc68bc703.jpg',
              title: 'private sample',
              desc: '',
              tags: [],
            },
            {
              kinescope_id: '4a836ff7-d831-4f69-a8ac-b35c88c4ea5d',
              thumb_url:
                'https://kinescopecdn.net/ddf53242-63ff-480d-9004-4a8cc9345a55/posters/02cf3d75-f056-434a-bd25-35be3bd83f6e/md/8bde6a04-07fe-46e1-844d-f61d735910a3.jpg',
              title: 'public sample',
              desc: '',
              tags: ['public'],
            },
            {
              thumb_url:
                'https://kinescopecdn.net/ddf53242-63ff-480d-9004-4a8cc9345a55/posters/932135da-6d05-4530-946b-583b3d135e6f/md/4bd815a8-a115-4217-ac60-7332ceccb637.jpg',
              title: 'sample',
              desc: '',
              tags: [],
            },
          ],
        },
      ],
      workshops: [
        {
          title: 'Naris',
          children: [
            {
              thumb_url:
                'https://kinescopecdn.net/ddf53242-63ff-480d-9004-4a8cc9345a55/posters/4905f538-6052-4ea6-a37a-452cf5a057df/md/df6260a4-370c-4f7d-aac6-0a8ca9316d5a.jpg',
              title: 'sample',
              desc: '',
              tags: [],
            },
          ],
        },
      ],
    },
  },
};

export default {
  title: 'MetricsComponent',
  component: MetricsComponent,
  decorators: [
    moduleMetadata({
      declarations: [TargetsListComponent, MetricsListComponent, PercentStatusStrategyPipe, CountStatusStrategyPipe],
      imports: [RouterTestingModule, DemoNgZorroAntdModule, TileModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
        {
          provide: 'workbooks',
          useValue: {},
        },
        {
          provide: 'targets',
          useValue: {},
        },
        {
          provide: 'questions',
          useValue: {},
        },
        {
          provide: PersonalActivityService,
          useValue: {
            getWatchedVideos: () => [],
          },
        },
        {
          provide: DataStoreService,
          useValue: {
            of: () =>
              of({
                owner: {
                  schema: {
                    url: 'questions/:qid',
                  },
                  key: {
                    qid: '',
                  },
                },
                payload: {
                  status: 'ok',
                  items: [
                    {
                      id: 3792,
                      json: '{"title":"sdf","overview":"sdfsdfs","progress":0,"tasks":[{"title":"sldjfsdf","overview":"","progress":0,"tasks":[]},{"title":"sdfsdfsdf","overview":"","progress":0,"tasks":[]},{"title":"sdfsdfsadsf","overview":"","progress":0,"tasks":[]}]}',
                      namespace: 'targets',
                      accessTag: 'PRIVATE',
                      createdAt: '2022-12-28T16:30:04.000Z',
                      updatedAt: '2022-12-28T16:35:15.000Z',
                    },
                    {
                      id: 3799,
                      namespace: 'targets',
                      accessTag: 'PRIVATE',
                      createdAt: '2022-12-28T16:30:04.000Z',
                      updatedAt: '2022-12-28T16:35:15.000Z',
                      json: JSON.stringify({
                        title: 'Посмотреть "Введение в архитектурные стримы"',
                        overview:
                          'Просмотр архитектурных стримов позволят сформировать абстрактное мышление, понять основные архитектурные идеи, которые лежат за проектированием программного обеспечения. Это позволит двигаться по карьере и лучше понять программирование.',
                        progress: 50,
                        tasks: [
                          {
                            title: 'Стрим просмотрен',
                            overview: '',
                            progress: 100,
                            tasks: [],
                          },
                          {
                            title: 'Написан конспект по следующим вопросам',
                            overview: '',
                            progress: 0,
                            tasks: [],
                          },
                        ],
                        id: 3799,
                      }),
                    },
                  ],
                },
                params: {},
              }),
          },
        },
      ],
    }),
  ],
} as Meta<MetricsComponent>;

export const Primary: StoryFn = () => ({});
