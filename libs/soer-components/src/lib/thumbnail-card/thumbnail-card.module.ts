import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';

import { ThumbnailCardComponent } from './thumbnail-card.component';

@NgModule({
  imports: [CommonModule, NzCardModule],
  declarations: [ThumbnailCardComponent],
  exports: [ThumbnailCardComponent],
})
export class ThumbnailCardModule {}
