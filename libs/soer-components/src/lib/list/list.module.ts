import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzListModule } from 'ng-zorro-antd/list';

import { ListComponent } from './list.component';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, NzListModule],
  exports: [ListComponent],
})
export class ListModule {}
