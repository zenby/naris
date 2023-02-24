import { TargetsListComponent } from "./targets-list.component";
import { Story, Meta, moduleMetadata } from '@storybook/angular';
import { TileModule } from "@soer/soer-components";
import { NzGridModule } from "ng-zorro-antd/grid";

export default {
  title: 'TargetsListComponent',
  component: TargetsListComponent,
  decorators: [
    moduleMetadata({
      imports: [TileModule, NzGridModule]
    })
  ]
} as Meta<TargetsListComponent>;

const Template: Story<TargetsListComponent> = (args: TargetsListComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
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
      }
    ]
  }
};

export const TargetsEmpty = Template.bind({});
TargetsEmpty.args = {
  targets: {
    status: 'ok',
    items: []
  }
}
