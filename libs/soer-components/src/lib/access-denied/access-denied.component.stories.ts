import { RouterTestingModule } from '@angular/router/testing';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { NzResultModule } from 'ng-zorro-antd/result';
import { AccessDeniedComponent } from './access-denied.component';

export default {
  title: 'AccessDeniedComponent',
  component: AccessDeniedComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule, NzResultModule],
      providers: [],
    }),
  ],
} as Meta<AccessDeniedComponent>;

const Template: Story<AccessDeniedComponent> = (args: AccessDeniedComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
