import { HttpClientModule } from '@angular/common/http';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CertificateComponent } from './certificate.component';
import { of } from 'rxjs';
import { SrAuthModule } from '@soer/sr-auth';
import { DataStoreService, SrDTOModule } from '@soer/sr-dto';
import { ANY_SERVICE, BusEmitter } from '@soer/mixed-bus';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DemoNgZorroAntdModule, Role } from '@soer/soer-components';
import { RouterTestingModule } from '@angular/router/testing';

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
  title: 'CertificateComponent',
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
        SrAuthModule,
        SrDTOModule,
      ],
      providers: [
        { provide: 'manifest', useValue: ANY_SERVICE },
        { provide: DataStoreService, useValue: mockDataStoreService },
        { provide: 'AuthServiceConfig', useValue: {} },
      ],
    }),
  ],
} as Meta<CertificateComponent>;

const Template: Story<CertificateComponent> = (args: CertificateComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};

export const Success = Template.bind({});
Success.args = {
  certObject: {
    role: Role.PRO,
    status: 'succeeded',
    exp: new Date(),
  },
};

export const Pending = Template.bind({});
Pending.args = {
  certObject: {
    role: Role.PRO,
    status: 'pending',
    exp: new Date(),
  },
};

export const New = Template.bind({});
New.args = {
  certObject: {
    role: Role.PRO,
    status: 'new',
    exp: new Date(),
  },
};

export const Undefined = Template.bind({});
Undefined.args = {
  certObject: {
    role: Role.PRO,
    status: 'undefined',
    exp: new Date(),
  },
};

export const Inuse = Template.bind({});
Inuse.args = {
  certObject: {
    role: Role.PRO,
    status: 'inuse',
    exp: new Date(),
  },
};
