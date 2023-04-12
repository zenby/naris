import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { ThumbnailCardComponent } from './thumbnail-card.component';
import { ThumbnailCardModule } from './thumbnail-card.module';

export default {
  title: 'ThumbnailCardComponent',
  component: ThumbnailCardComponent,
  decorators: [
    moduleMetadata({
      imports: [ThumbnailCardModule, NzGridModule, CommonModule, NzLayoutModule, NzStatisticModule],
    }),
  ],
} as Meta<ThumbnailCardComponent>;

export const Primary: StoryFn = () => ({
  props: {
    title: 'Some Title',
    description: 'Some Description',
    img: '',
  },
});
