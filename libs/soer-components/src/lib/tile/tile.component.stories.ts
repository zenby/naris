import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { TileComponent } from './tile.component';
import { TileModule } from './tile.module';

export default {
  title: 'TileComponent',
  component: TileComponent,
  decorators: [
    moduleMetadata({
      imports: [TileModule, NzGridModule, CommonModule, NzLayoutModule, NzStatisticModule],
    }),
  ],
} as Meta<TileComponent>;

const Template: Story<TileComponent> = (args: TileComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  tile: {
    title: 'Посмотреть все архитектурные стримы',
    value: 50,
    suffix: '%',
    status: 'none',
  },
};

export const Normal = Template.bind({});
Normal.args = {
  tile: {
    title: 'Посмотреть все архитектурные стримы',
    value: 100,
    suffix: '%',
    status: 'normal',
  },
};

export const Warning = Template.bind({});
Warning.args = {
  tile: {
    title: 'Посмотреть все архитектурные стримы',
    value: 30,
    suffix: '%',
    status: 'warning',
  },
};

export const Critical = Template.bind({});
Critical.args = {
  tile: {
    title: 'Посмотреть все архитектурные стримы',
    value: 5,
    suffix: '%',
    status: 'critical',
  },
};
