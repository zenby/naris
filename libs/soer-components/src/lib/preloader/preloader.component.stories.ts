import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { of } from 'rxjs';
import { PreloaderService } from './preloader.service';
import { PreloaderComponent } from './preloader.component';

export default {
  title: 'Libs/Components/PreloaderComponent',
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

export const Primary: StoryFn = () => ({});
