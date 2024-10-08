import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { ToolbarComponent } from './toolbar.component';

export default {
  title: 'ToolbarComponent',
  component: ToolbarComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ToolbarComponent>;

export const Primary: StoryFn = () => ({
  props: {
    size: 'small',
    actions: [],
  },
});
