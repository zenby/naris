import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      {
        path: 'profile',
        data: {
          header: { title: 'Профиль', subtitle: 'основная информация' },
        },
        component: ProfilePageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    SrDTOModule.forChild<WorkbookKey>({
      namespace: 'workbook',
      schema: { url: 'v2/json/workbook/:wid' },
      keys: {
        workbook: { wid: '?' },
        workbooks: { wid: 'personal' },
      },
    }),

    SrDTOModule.forChild<WorkbookKey>({
      namespace: 'quiz',
      schema: { url: 'v2/json/quiz/:wid' },
      keys: {
        quiz: { wid: '?' },
        quizs: { wid: 'personal' },
      },
    }),

    SrDTOModule.forChild<WorkbookKey>({
      namespace: 'articles',
      schema: { url: '%%narisApiUrl%%v3/json/article/:wid' },
      keys: {
        article: { wid: '?' },
        articles: { wid: '' },
      },
    }),

    SrDTOModule.forChild<QuestionKey>({
      namespace: 'qa',
      schema: { url: 'questions/:qid' },
      keys: {
        questionsAll: { qid: 'all' },
        questions: { qid: '' },
        question: { qid: '?' },
      },
    }),
    SrDTOModule.forChild<TargetKey>({
      namespace: 'targets',
      schema: { url: 'v2/json/targets/:tid' },
      keys: {
        target: { tid: '?' },
        targets: { tid: 'personal' },
      },
    }),
    SrDTOModule.forChild<TemplateKey>({
      namespace: 'templates',
      schema: { url: 'v2/json/templates/:tid' },
      keys: {
        template: { tid: '?' },
        templates: { tid: 'personal' },
        publicTemplates: { tid: 'public' },
      },
    }),
    QuestionsRoutingModule,
    TargetsRoutingModule,
    AbstracteRoutingModule,
    OverviewRoutingModule,
  ],
  providers: [StreamService, WorkshopsService, ByRoutePathResolver],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
