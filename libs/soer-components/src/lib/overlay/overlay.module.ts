import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { OverlayComponent } from './overlay.component';

@NgModule({
  imports: [CommonModule, NzIconModule],
  declarations: [OverlayComponent],
  exports: [OverlayComponent],
})
export class OverlayModule {}
