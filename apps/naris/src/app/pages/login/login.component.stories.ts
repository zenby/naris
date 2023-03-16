import { LoginComponent } from './login.component';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DemoNgZorroAntdModule } from '@soer/soer-components';
import { SrAuthModule } from '@soer/sr-auth';

export default {
  title: 'LoginComponent',
  component: LoginComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterModule.forRoot([], { useHash: true }), SrAuthModule, HttpClientModule, DemoNgZorroAntdModule],
      providers: [{ provide: 'AuthServiceConfig', useValue: {} }],
    }),
  ],
} as Meta<LoginComponent>;

const Template: Story<LoginComponent> = (args: LoginComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  loading: false,
};
