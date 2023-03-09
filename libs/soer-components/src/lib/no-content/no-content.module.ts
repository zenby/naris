import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzResultModule } from 'ng-zorro-antd/result';
import { OverlayModule } from '../overlay/overlay.module';
import { NoContentComponent } from './no-content.component';

@NgModule({
  imports: [CommonModule, NzResultModule, OverlayModule, RouterModule],
  declarations: [NoContentComponent],
  exports: [NoContentComponent],
})
export class NoContentModule {}
