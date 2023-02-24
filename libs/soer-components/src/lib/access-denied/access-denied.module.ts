import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzResultModule } from 'ng-zorro-antd/result';
import { AccessDeniedComponent } from './access-denied.component';

@NgModule({
  imports: [CommonModule, NzResultModule, RouterModule],
  declarations: [AccessDeniedComponent],
  exports: [AccessDeniedComponent],
})
export class AccessDeniedModule {}
