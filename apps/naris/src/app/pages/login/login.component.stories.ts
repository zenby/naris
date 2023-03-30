import { LoginComponent } from './login.component';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { HttpClientModule } from '@angular/common/http';
import { DemoNgZorroAntdModule } from '@soer/soer-components';
import { SrAuthModule } from '@soer/sr-auth';
import { RouterTestingModule } from '@angular/router/testing';

export default {
  title: 'LoginComponent',
  component: LoginComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule, SrAuthModule, HttpClientModule, DemoNgZorroAntdModule],
      providers: [{ provide: 'AuthServiceConfig', useValue: {} }],
    }),
  ],
} as Meta<LoginComponent>;

export const Primarsy: StoryFn = () => ({
  props: {
    loading: false,
  },
});

export const Primary: StoryFn = () => ({});
