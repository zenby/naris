import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BlockEditorControlsComponent } from './block-editor-controls.component';

export default {
  title: 'BlockEditorControlsComponent',
  component: BlockEditorControlsComponent,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    moduleMetadata({
      imports: [NzIconModule, NzButtonModule],
    }),
  ],
} as Meta<BlockEditorControlsComponent>;

const Template: Story<BlockEditorControlsComponent> = (args: BlockEditorControlsComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  controls: [
    {
      title: 'Переместить вверх',
      icon: 'up',
      handler: () => {
        alert('up click');
      },
    },
    {
      title: 'Переместить вниз',
      icon: 'down',
      handler: () => {
        alert('down click');
      },
    },
    {
      title: 'Удалить',
      icon: 'delete',
      handler: () => {
        alert('delete click');
      },
    },
  ],
};
