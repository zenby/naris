import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { CarouselComponent } from './carousel.component';

@NgModule({
  imports: [CommonModule, NzButtonModule, NzIconModule],
  declarations: [CarouselComponent],
  exports: [CarouselComponent],
})
export class CarouselModule {}
