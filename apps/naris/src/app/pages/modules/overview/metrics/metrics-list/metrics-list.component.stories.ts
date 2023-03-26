import { MetricsListComponent } from './metrics-list.component';
import { Story, Meta, moduleMetadata } from '@storybook/angular';
import { TileModule } from '@soer/soer-components';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { PercentStatusStrategyPipe } from './strategies/percent-status-strategy.pipe';
import { CountStatusStrategyPipe } from './strategies/count-status-strategy.pipe';

export default {
  title: 'MetricsListComponent',
  component: MetricsListComponent,
  decorators: [
    moduleMetadata({
      imports: [TileModule, NzGridModule],
      declarations: [PercentStatusStrategyPipe, CountStatusStrategyPipe],
    }),
  ],
} as Meta<MetricsListComponent>;

const Template: Story<MetricsListComponent> = (args: MetricsListComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
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
};
