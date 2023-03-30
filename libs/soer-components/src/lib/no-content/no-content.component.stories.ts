import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { NzResultModule } from 'ng-zorro-antd/result';
import { OverlayModule } from '../overlay/overlay.module';
import { NoContentComponent } from './no-content.component';

export default {
  title: 'NoContentComponent',
  component: NoContentComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule, NzResultModule, OverlayModule, HttpClientModule],
    }),
  ],
} as Meta<NoContentComponent>;

export const Primary: StoryFn = () => ({});
