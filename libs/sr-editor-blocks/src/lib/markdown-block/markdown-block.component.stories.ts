import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { MarkdownBlockComponent } from './markdown-block.component';

export default {
  title: 'MarkdownBlockComponent',
  component: MarkdownBlockComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<MarkdownBlockComponent>;

export const Primary: StoryFn = () => ({
  props: {
    text: '',
  },
});
