import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { SrDTOModule } from '@soer/sr-dto';
import { NoContentComponent } from '@soer/soer-components';
import { ByRoutePathResolver } from '../api/by-route-path.resolver';
import { StreamService } from '../api/streams/stream.service';
import { WorkshopsService } from '../api/workshops/workshops.service';

import { SourcesComponent } from './modules/sources/sources.component';
import { AbstracteRoutingModule } from './modules/abstracte/abstracte-routing.module';
import { WorkbookKey } from './modules/abstracte/abstracte.const';
import { CertificateComponent } from './modules/certificate/certificate/certificate.component';
import { ComposeVideoPlayerComponent } from './modules/compose-video-player/compose-video-player.component';
import { OverviewRoutingModule } from './modules/overview/overview-routing.module';
import { PayFormComponent } from './modules/payment/pay-form/pay-form.component';
import { ProfilePageComponent } from './modules/account-page/profile-page/profile-page.component';
import { QuestionKey } from './modules/questions/questions.const';
import { QuestionsRoutingModule } from './modules/questions/questions.routing.module';
import { RoadmapComponent } from './modules/roadmap/roadmap.component';
import { StreamsComponent } from './modules/streams/streams.component';
import { TargetsRoutingModule } from './modules/targets/targets-routing.module';
import { TargetKey, TemplateKey } from './modules/targets/targets.const';
import { ComposeTabPageComponent } from './router-compose/compose-tab-page/compose-tab-page.component';
import { environment } from '../../environments/environment';
import { featuresEnum } from '../../environments/environment.interface';
import { ActivityJournalPageComponent } from './modules/account-page/activity-journal-page/activity-journal-page.component';
import { JsonDocumentKey } from './modules/json-settings/document.const';

const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'prefix' },
  {
    path: 'certificate',
    data: { header: { title: 'Подарочный сертификат', subtitle: 'использовать сертификат' } },
    component: CertificateComponent,
  },
  {
    path: 'pay',
    data: { header: { title: 'Выбор тарифа', subtitle: 'определите уровень платного доступа' } },
    component: PayFormComponent,
  },
  {
    path: 'streams',
    component: StreamsComponent,
    data: { header: { title: 'Архитектурные стримы', subtitle: 'грамотно строим работу над приложением' } },
    resolve: { streams: StreamService },
    children: [
      {
        path: 'novideo',
        component: NoContentComponent,
        data: { header: { title: 'Смотрим стрим...' } },
      },
      {
        path: ':videoSource/:videoId',
        component: ComposeVideoPlayerComponent,
        data: { header: { title: 'Смотрим стрим...' } },
      },
    ],
  },
  {
    path: 'workshops',
    component: StreamsComponent,
    data: { header: { title: 'Мастерклассы', subtitle: 'создаем приложение по шагам' } },
    resolve: { streams: WorkshopsService },
    children: [
      {
        path: 'novideo',
        component: NoContentComponent,
        data: { header: { title: 'Смотрим стрим...' } },
      },
      {
        path: ':videoSource/:videoId',
        component: ComposeVideoPlayerComponent,
        data: { header: { title: 'Смотрим воркшоп...' } },
      },
    ],
  },
  {
    path: 'book',
    component: RoadmapComponent,
    data: { header: { title: 'Главы книги', subtitle: 'быстрый старт в карьере' } },
    resolve: {
      target: ByRoutePathResolver,
    },
  },
  {
    path: 'sources',
    component: SourcesComponent,
    data: { header: { title: 'Исходники проектов', subtitle: '' } },
    resolve: {
      webfiles: ByRoutePathResolver,
    },
  },

  {
    path: 'account',
    component: ComposeTabPageComponent,
    data: { header: { title: 'Личный кабинет', subtitle: 'данные пользователя' } },
    children: (() => {
      const routes: Route[] = [
        { path: '', redirectTo: 'profile', pathMatch: 'full' },
        {
          path: 'profile',
          data: {
            header: { title: 'Профиль', subtitle: 'основная информация' },
          },
          component: ProfilePageComponent,
        },
      ];

      if (environment.features[featuresEnum.personal_activity_journal]) {
        routes.push({
          path: 'activity-journal',
          data: {
            header: { title: 'Журнал активности', subtitle: 'пользователя' },
          },
          component: ActivityJournalPageComponent,
          resolve: {
            activites: 'activitesEmitter',
          },
        });
      }

      if (environment.features[featuresEnum.subscription]) {
        routes.push({
          path: 'subscription',
          data: {
            header: { title: 'Подписка' },
          },
          component: PayFormComponent,
        });
      }

      return routes;
    })(),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    SrDTOModule.forChild<WorkbookKey>(
      environment.features[featuresEnum.api_v2]
        ? {
            namespace: 'workbook',
            schema: { url: '%%narisApiUrl%%v3/json/workbook/:wid' },
            keys: {
              workbook: { wid: '?' },
              workbooks: { wid: 'private' },
            },
          }
        : {
            namespace: 'workbook',
            schema: { url: 'v2/json/workbook/:wid' },
            keys: {
              workbook: { wid: '?' },
              workbooks: { wid: 'personal' },
            },
          }
    ),

    SrDTOModule.forChild<JsonDocumentKey>({
      namespace: 'document',
      schema: { url: '%%narisApiUrl%%v1/document/:did' },
      keys: {
        jsonDocument: { did: '?' },
      },
    }),

    SrDTOModule.forChild<WorkbookKey>(
      environment.features[featuresEnum.api_v2]
        ? {
            namespace: 'quiz',
            schema: { url: '%%narisApiUrl%%v3/json/quiz/:wid' },
            keys: {
              quiz: { wid: '?' },
              quizs: { wid: 'private' },
            },
          }
        : {
            namespace: 'quiz',
            schema: { url: 'v2/json/quiz/:wid' },
            keys: {
              quiz: { wid: '?' },
              quizs: { wid: 'personal' },
            },
          }
    ),

    SrDTOModule.forChild<WorkbookKey>(
      environment.features[featuresEnum.api_v2]
        ? {
            namespace: 'articles',
            schema: { url: '%%narisApiUrl%%v3/json/article/:wid' },
            keys: {
              article: { wid: '?' },
              articles: { wid: 'private' },
            },
          }
        : {
            namespace: 'articles',
            schema: { url: 'v2/json/article/:wid' },
            keys: {
              article: { wid: '?' },
              articles: { wid: 'personal' },
            },
          }
    ),

    SrDTOModule.forChild<QuestionKey>({
      namespace: 'qa',
      schema: { url: 'questions/:qid' },
      keys: {
        questionsAll: { qid: 'all' },
        questions: { qid: '' },
        question: { qid: '?' },
      },
    }),

    SrDTOModule.forChild<TargetKey>(
      environment.features[featuresEnum.api_v2]
        ? {
            namespace: 'targets',
            schema: { url: '%%narisApiUrl%%v3/json/targets/:tid' },
            keys: {
              target: { tid: '?' },
              targets: { tid: 'private' },
            },
          }
        : {
            namespace: 'targets',
            schema: { url: 'v2/json/targets/:tid' },
            keys: {
              target: { tid: '?' },
              targets: { tid: 'personal' },
            },
          }
    ),
    SrDTOModule.forChild<TemplateKey>(
      environment.features[featuresEnum.api_v2]
        ? {
            namespace: 'templates',
            schema: { url: '%%narisApiUrl%%v3/json/templates/:tid' },
            keys: {
              template: { tid: '?' },
              templates: { tid: 'private' },
              publicTemplates: { tid: 'public' },
            },
          }
        : {
            namespace: 'templates',
            schema: { url: 'v2/json/templates/:tid' },
            keys: {
              template: { tid: '?' },
              templates: { tid: 'personal' },
              publicTemplates: { tid: 'public' },
            },
          }
    ),
    QuestionsRoutingModule,
    TargetsRoutingModule,
    AbstracteRoutingModule,
    OverviewRoutingModule,
  ],
  providers: [StreamService, WorkshopsService, ByRoutePathResolver],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
