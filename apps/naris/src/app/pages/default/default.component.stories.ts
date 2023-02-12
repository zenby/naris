import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DefaultComponent } from './default.component';
import { ANY_SERVICE } from '@soer/mixed-bus';
import { SrAuthModule } from '@soer/sr-auth';
import { DemoNgZorroAntdModule } from '../demo.module';
import { PersonalActivityService } from '../../api/progress/personal-activity.service';
import { DataStoreService, SrDTOModule } from '@soer/sr-dto';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

const dataStoreServiceMock = {
  of: (manifestId: any) => {
    return of({
      owner: manifestId,
      payload: {
        "status": "ok",
        "items": [
          {
            "email": null,
            "firstName": null,
            "lastName": null,
            "role": "GUEST",
            "expired": null,
            "namespaces": []
          }
        ]
      },
    });
  }
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
          provide: ActivatedRoute,
          useValue: {}
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
Primary.args = {};
