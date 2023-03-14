import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DefaultComponent } from './default.component';
import { BusMessage } from '@soer/mixed-bus';
import { JWTModel } from '@soer/sr-auth';
import { DemoNgZorroAntdModule } from '../demo.module';
import { extractDtoPackFromBus, SrDTOModule } from '@soer/sr-dto';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { Observable } from 'rxjs';
import { ApplicationService } from '../../services/application.service';

const dataStoreServiceMock = {
  of: (manifestId?: any): Observable<BusMessage> => {
    return of({
      owner: manifestId,
      params: {},
      payload: {
        status: 'ok',
        items: [
          {
            email: 'mock@gmail.com',
            firstName: 'first name',
            lastName: 'last name',
            role: 'PRO',
            expired: null,
            namespaces: [],
          },
        ],
      },
    });
  },
};

const applicationServiceMock = {
  user: {
    id: '',
    email: '',
    role: '',
  },
  user$: extractDtoPackFromBus<JWTModel>(dataStoreServiceMock.of()),
  auth: {
    logout: () => true,
  },
};

export default {
  title: 'DefaultComponent',
  component: DefaultComponent,
  decorators: [
    moduleMetadata({
      imports: [
        HttpClientModule,
        DemoNgZorroAntdModule,
        NoopAnimationsModule,
        CommonModule,
        RouterTestingModule,
        SrDTOModule,
      ],
      declarations: [MobileMenuComponent],
      providers: [
        { provide: 'AuthServiceConfig', useValue: {} },
        {
          provide: APP_BASE_HREF,
          useValue: '/',
        },
        { provide: ApplicationService, useValue: applicationServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            children: [],
            snapshot: {
              data: {
                header: {
                  title: 'title',
                  subtitle: 'subtitle',
                },
              },
            },
          },
        },
      ],
    }),
  ],
} as Meta<DefaultComponent>;

const Template: Story<DefaultComponent> = (args: DefaultComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  isMobileView: false,
};

Primary.parameters = {
  layout: 'fullscreen',
};
