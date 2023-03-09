import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { NzResultModule } from 'ng-zorro-antd/result';
import { UnderDevelopmentComponent } from './under-development.component';

export default {
  title: 'UnderDevelopmentComponent',
  component: UnderDevelopmentComponent,
  decorators: [
    moduleMetadata({
      imports: [NzResultModule],
      providers: [],
    }),
  ],
} as Meta<UnderDevelopmentComponent>;

const Template: Story<UnderDevelopmentComponent> = (args: UnderDevelopmentComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
