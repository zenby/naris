import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverlayModule } from '../overlay/overlay.module';
import { PopupContentComponent } from './popup-content.component';

@NgModule({
  imports: [CommonModule, OverlayModule, RouterModule],
  declarations: [PopupContentComponent],
  exports: [PopupContentComponent],
})
export class PopupContentModule {}
