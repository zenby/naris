import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzResultModule } from 'ng-zorro-antd/result';
import { UnderDevelopmentComponent } from './under-development.component';

@NgModule({
  imports: [CommonModule, NzResultModule],
  declarations: [UnderDevelopmentComponent],
  exports: [UnderDevelopmentComponent],
})
export class UnderDevelopmentModule {}
