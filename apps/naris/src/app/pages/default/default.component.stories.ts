import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DefaultComponent } from './default.component';
import { ANY_SERVICE } from '@soer/mixed-bus';
import { SrAuthModule } from '@soer/sr-auth';
import { ApplicationService } from '../../services/application.service';
import { DemoNgZorroAntdModule } from '../demo.module';
import { PersonalActivityService } from '../../api/progress/personal-activity.service';
import { SrDTOModule } from '@soer/sr-dto';
import { MAIN_MENU } from './menu.const';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const mockApplicationService = {
    user$: {
        "email": null,
        "firstName": null,
        "lastName": null,
        "role": "GUEST",
        "expired": null,
        "namespaces": []
    },
    mainMenu: MAIN_MENU
};

export default {
  title: 'DefaultComponent',
  component: DefaultComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterModule.forRoot([], { useHash: true }), HttpClientModule, DemoNgZorroAntdModule, HttpClientTestingModule, SrDTOModule, SrAuthModule],
      providers: [
        { provide: 'issues', useValue: ANY_SERVICE },
        { provide: 'manifest', useValue: ANY_SERVICE },
        { provide: 'AuthServiceConfig', useValue: {} },
        {
          provide: APP_BASE_HREF,
          useValue: '/',
        },
        {
          provide: ApplicationService,
          useValue: mockApplicationService
        },
        {
          provide: ActivatedRoute,
          useValue: {}
        },
        {
          provide: PersonalActivityService,
          useValue: {}
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
Primary.args = {};
