import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { of } from 'rxjs';
import { PreloaderService } from './preloader.service';
import { PreloaderComponent } from './preloader.component';

export default {
  title: 'PreloaderComponent',
  component: PreloaderComponent,
  decorators: [
    moduleMetadata({
      imports: [NzSpinModule],
      providers: [
        {
          provide: PreloaderService,
          useValue: {
            loadingAction$: of(true),
          },
        },
      ],
    }),
  ],
} as Meta<PreloaderComponent>;

const Template: Story<PreloaderComponent> = (args: PreloaderComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
