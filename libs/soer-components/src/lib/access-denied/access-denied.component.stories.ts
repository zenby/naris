import { RouterTestingModule } from '@angular/router/testing';
import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { NzResultModule } from 'ng-zorro-antd/result';
import { AccessDeniedComponent } from './access-denied.component';

export default {
  title: 'Libs/Components/AccessDeniedComponent',
  component: AccessDeniedComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule, NzResultModule],
      providers: [],
    }),
  ],
} as Meta<AccessDeniedComponent>;

export const Primary: StoryFn = () => ({});
