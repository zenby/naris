import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { OverlayComponent } from './overlay.component';

export default {
  title: 'OverlayComponent',
  component: OverlayComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<OverlayComponent>;

const Template: Story<OverlayComponent> = (args: OverlayComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  activate: true,
};
