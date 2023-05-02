import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoContentComponent } from '@soer/soer-components';
import { ByRoutePathResolver } from '../../../api/by-route-path.resolver';
import { StreamService } from '../../../api/streams/stream.service';
import { WorkshopsService } from '../../../api/workshops/workshops.service';
import { ComposeIcontabsPageComponent } from '../../router-compose/compose-icontabs-page/compose-icontabs-page.component';
import { ComposeVideoPlayerComponent } from '../compose-video-player/compose-video-player.component';
import { CalendarPageComponent } from './calendar/calendar-page.component';
import { InfoComponent } from './info/info.component';
import { LatestComponent } from './latest/latest.component';
import { MetricsComponent } from './metrics/metrics.component';

const routes: Routes = [
  {
    path: 'overview',
    component: ComposeIcontabsPageComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'info',
      },

      {
        path: 'metrics',
        data: { header: { title: 'Метрики', subtitle: 'отражают ваши достижения и цели', icon: 'pie-chart' } },
        component: MetricsComponent,
        resolve: {
          workbooks: 'workbooksEmitter',
          targets: 'targetsEmitter',
          questions: 'questionsEmitter',
          streams: StreamService,
          workshops: WorkshopsService,
        },
      },
      {
        path: 'info',
        data: { header: { title: 'Информация', subtitle: 'контакты и группы сообщества', icon: 'info-circle' } },
        component: InfoComponent,
        resolve: {
          brif: ByRoutePathResolver,
        },
      },
      {
        path: 'latest',
        data: { header: { title: 'Новые материалы', subtitle: 'последние видео и воркшопы', icon: 'star' } },
        component: LatestComponent,
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
        path: 'calendar',
        data: { header: { title: 'Календарь', subtitle: '', icon: 'calendar' } },
        component: CalendarPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverviewRoutingModule {}
