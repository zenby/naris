import { moduleMetadata, Story, Meta } from '@storybook/angular';
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

const Template: Story<MarkdownBlockComponent> = (args: MarkdownBlockComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  text: '',
};
