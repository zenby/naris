import { RouterTestingModule } from '@angular/router/testing';
import { TileModule } from '@soer/soer-components';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CountStatusStrategyPipe } from '../metrics-list/strategies/count-status-strategy.pipe';
import { PercentStatusStrategyPipe } from '../metrics-list/strategies/percent-status-strategy.pipe';
import { TargetsListComponent } from './targets-list.component';

export default {
  title: 'TargetsListComponent',
  component: TargetsListComponent,
  decorators: [
    moduleMetadata({
      declarations: [PercentStatusStrategyPipe, CountStatusStrategyPipe],
      imports: [RouterTestingModule, TileModule, NzGridModule],
    }),
  ],
} as Meta<TargetsListComponent>;

export const Primary: StoryFn = () => ({
  props: {
    targets: {
      status: 'ok',
      items: [
        {
          id: 1,
          title: 'Выучить Python',
          overview: '',
          progress: 30,
          tasks: [],
        },
        {
          id: 2,
          title: 'Посмотреть все воркшопы',
          overview: '',
          progress: 48,
          tasks: [],
        },
      ],
    },
  },
});

export const TargetsEmpty: StoryFn = () => ({
  props: {
    targets: {
      status: 'ok',
      items: [],
    },
  },
});
