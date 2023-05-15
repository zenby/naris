import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ActivityCalendarModule, NoContentModule, TileModule } from '@soer/soer-components';
import { ThumbnailCardModule } from '@soer/soer-components';
import { ByRoutePathResolver } from '../../../api/by-route-path.resolver';
import { StreamService } from '../../../api/streams/stream.service';
import { WorkshopsService } from '../../../api/workshops/workshops.service';
import { VideoService } from '../../../services/video/video.service';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';

import { MetricsComponent } from './metrics/metrics.component';
import { InfoComponent } from './info/info.component';
import { TargetsListComponent } from './metrics/targets-list/targets-list.component';
import { MetricsListComponent } from './metrics/metrics-list/metrics-list.component';
import { PercentStatusStrategyPipe } from './metrics/metrics-list/strategies/percent-status-strategy.pipe';
import { CountStatusStrategyPipe } from './metrics/metrics-list/strategies/count-status-strategy.pipe';
import { LatestComponent } from './latest/latest.component';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';

@NgModule({
  declarations: [
    MetricsComponent,
    MetricsListComponent,
    TargetsListComponent,
    InfoComponent,
    PercentStatusStrategyPipe,
    CountStatusStrategyPipe,
    LatestComponent,
    CalendarPageComponent,
  ],
  imports: [
    CommonModule,
    ThumbnailCardModule,
    TileModule,
    FormsModule,
    NzFormModule,
    RouterModule,
    NzSpinModule,
    NzCardModule,
    NzIconModule,
    NzLayoutModule,
    NzDividerModule,
    NzStatisticModule,
    NzGridModule,
    NzTypographyModule,
    NoContentModule,
    NzCalendarModule,
    ActivityCalendarModule,
  ],
  providers: [StreamService, WorkshopsService, ByRoutePathResolver, VideoService],
  exports: [],
})
export class OverviewModule {}
