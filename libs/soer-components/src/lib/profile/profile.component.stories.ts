import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ProfileComponent } from './profile.component';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { Role } from './profile.model';

export default {
  title: 'ProfileComponent',
  component: ProfileComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NzTypographyModule],
    }),
  ],
} as Meta<ProfileComponent>;

const Template: Story<ProfileComponent> = (args: ProfileComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  profile: {
    email: 'test@gmail.com',
    fullname: 'Соер Соерович',
    role: Role.PRO,
  },
};
