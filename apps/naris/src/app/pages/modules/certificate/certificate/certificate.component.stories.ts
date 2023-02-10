import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CertificateComponent } from './certificate.component';
import { of } from 'rxjs';
import { SrAuthModule } from '@soer/sr-auth';
import { DataStoreService, SrDTOModule } from '@soer/sr-dto';
import { ANY_SERVICE } from '@soer/mixed-bus';
import { DemoNgZorroAntdModule } from '../../../demo.module';
import { FormsModule } from '@angular/forms'; 
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

const mockDataStoreService = {
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
      params: {}
    });
  }
};

export default {
  title: 'CertificateComponent',
  component: CertificateComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterModule.forRoot([], { useHash: true }), HttpClientModule, DemoNgZorroAntdModule, BrowserAnimationsModule, NoopAnimationsModule, FormsModule, SrAuthModule, SrDTOModule],
      providers: [
        { provide: 'manifest', useValue: ANY_SERVICE },
        { provide: DataStoreService, useValue: mockDataStoreService },
        { provide: 'AuthServiceConfig', useValue: {} },
      ]
    }),
  ],
} as Meta<CertificateComponent>;

const Template: Story<CertificateComponent> = (args: CertificateComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
