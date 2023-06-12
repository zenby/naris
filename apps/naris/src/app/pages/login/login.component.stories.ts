import { LoginComponent } from './login.component';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { HttpClientModule } from '@angular/common/http';
import { DemoNgZorroAntdModule } from '@soer/soer-components';
import { SrAuthModule } from '@soer/sr-auth';
import { RouterTestingModule } from '@angular/router/testing';
import { SrFeatureFlagsModule } from '@soer/sr-feature-flags';

export default {
  title: 'LoginComponent',
  component: LoginComponent,
  decorators: [
    moduleMetadata({
      imports: [
        RouterTestingModule,
        SrAuthModule.forRoot({
          sid: Symbol('Test'),
          schema: {
            cookieApi: '',
            renewApi: '',
            authApi: '',
          },
        }),
        SrFeatureFlagsModule.forRoot({ auth_v2: true }),
        HttpClientModule,
        DemoNgZorroAntdModule,
      ],
    }),
  ],
} as Meta<LoginComponent>;

export const Primary: StoryFn = () => ({
  props: {
    loading: false,
  },
});
