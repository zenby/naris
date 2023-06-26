import { MetricsListComponent } from './metrics-list.component';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { TileModule } from '@soer/soer-components';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { PercentStatusStrategyPipe } from './strategies/percent-status-strategy.pipe';
import { CountStatusStrategyPipe } from './strategies/count-status-strategy.pipe';

export default {
  title: 'Naris/Pages/MetricsList',
  component: MetricsListComponent,
  decorators: [
    moduleMetadata({
      imports: [TileModule, NzGridModule],
      declarations: [PercentStatusStrategyPipe, CountStatusStrategyPipe],
    }),
  ],
} as Meta<MetricsListComponent>;

export const Primary: StoryFn = () => ({
  props: {
    metrics: [
      {
        title: 'Цели',
        value: 2,
        icon: 'check-circle',
        url: '#!/pages/targets/list',
      },
      {
        title: 'Конспекты',
        value: 7,
        icon: 'solution',
        url: '#!/pages/workbook',
      },
    ],
  },
});
