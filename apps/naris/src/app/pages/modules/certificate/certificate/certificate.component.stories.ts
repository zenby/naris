import { HttpClientModule } from '@angular/common/http';
import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { CertificateComponent } from './certificate.component';
import { of } from 'rxjs';
import { SrAuthModule } from '@soer/sr-auth';
import { DataStoreService, SrDTOModule } from '@soer/sr-dto';
import { ANY_SERVICE, BusEmitter } from '@soer/mixed-bus';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DemoNgZorroAntdModule, Role } from '@soer/soer-components';
import { RouterTestingModule } from '@angular/router/testing';
import { SrFeatureFlagsModule } from '@soer/sr-feature-flags';

const mockDataStoreService = {
  of: (manifestId: BusEmitter) =>
    of({
      owner: manifestId,
      payload: {
        status: 'ok',
        items: [
          {
            email: null,
            firstName: null,
            lastName: null,
            role: 'GUEST',
            expired: null,
            namespaces: [],
          },
        ],
      },
      params: {},
    }),
};

export default {
  title: 'Naris/Pages/Certificate',
  component: CertificateComponent,
  decorators: [
    moduleMetadata({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        DemoNgZorroAntdModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        FormsModule,
        SrAuthModule.forRoot({
          sid: Symbol('Test'),
          schema: {
            cookieApi: '',
            renewApi: '',
            authApi: '',
          },
        }),
        SrFeatureFlagsModule.forRoot({ auth_v2: true }),
        SrDTOModule,
      ],
      providers: [
        { provide: 'manifest', useValue: ANY_SERVICE },
        { provide: DataStoreService, useValue: mockDataStoreService },
      ],
    }),
  ],
} as Meta<CertificateComponent>;

export const Primary: StoryFn = () => ({});

export const Success: StoryFn = () => ({
  props: {
    certObject: {
      role: Role.PRO,
      status: 'succeeded',
      exp: new Date(),
    },
  },
});

export const Pending: StoryFn = () => ({
  props: {
    certObject: {
      role: Role.PRO,
      status: 'pending',
      exp: new Date(),
    },
  },
});
export const New: StoryFn = () => ({
  props: {
    certObject: {
      role: Role.PRO,
      status: 'new',
      exp: new Date(),
    },
  },
});
export const Undefined: StoryFn = () => ({
  props: {
    certObject: {
      role: Role.PRO,
      status: 'undefined',
      exp: new Date(),
    },
  },
});
export const Inuse: StoryFn = () => ({
  props: {
    certObject: {
      role: Role.PRO,
      status: 'inuse',
      exp: new Date(),
    },
  },
});
