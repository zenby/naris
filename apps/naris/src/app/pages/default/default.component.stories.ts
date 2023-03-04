import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DefaultComponent } from './default.component';
import { ANY_SERVICE, BusMessage } from '@soer/mixed-bus';
import { JWTModel, SrAuthModule } from '@soer/sr-auth';
import { DemoNgZorroAntdModule } from '../demo.module';
import { PersonalActivityService } from '../../api/progress/personal-activity.service';
import { DataStoreService, extractDtoPackFromBus, SrDTOModule } from '@soer/sr-dto';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { Observable } from 'rxjs';
import { ApplicationService } from '../../services/application.service';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

const dataStoreServiceMock = {
  of: (manifestId?: any): Observable<BusMessage> => {
    return of({
      owner: manifestId,
      params: {},
      payload: {
        'status': 'ok',
        'items': [
          {
            'email': 'mock@gmail.com',
            'firstName': 'first name',
            'lastName': 'last name',
            'role': 'PRO',
            'expired': null,
            'namespaces': []
          }
        ]
      },
    });
  }
};

const applicationServiceMock = {
  user: {
    id: '',
    email: '',
    role: ''
  },
  user$: extractDtoPackFromBus<JWTModel>(dataStoreServiceMock.of())
}

export default {
  title: 'DefaultComponent',
  component: DefaultComponent,
  decorators: [
    moduleMetadata({
      imports: [
        HttpClientModule, DemoNgZorroAntdModule, BrowserAnimationsModule,
        NoopAnimationsModule, NzMenuModule, NzLayoutModule, CommonModule,
        RouterTestingModule, SrDTOModule, SrAuthModule
      ],
      declarations: [MobileMenuComponent],
      providers: [
        { provide: 'issues', useValue: ANY_SERVICE },
        { provide: 'manifest', useValue: ANY_SERVICE },
        { provide: 'AuthServiceConfig', useValue: {} },
        {
          provide: APP_BASE_HREF,
          useValue: '/',
        },
        {  provide: ApplicationService,
          useValue: applicationServiceMock
        },
        {
          provide: PersonalActivityService,
          useValue: {}
        },
        {
          provide: DataStoreService,
          useValue: dataStoreServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: {
            children: [],
            snapshot: {
              data: {
                'header': {
                  'title': 'title',
                  'subtitle': 'subtitle'
                }
              }
            }
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
  isMobileView: false
};

Primary.parameters = {
  layout: 'fullscreen'
}
