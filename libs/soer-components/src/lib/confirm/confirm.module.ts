import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfirmComponent } from './confirm.component';
import { ConfirmService } from './confirm.service';

@NgModule({
  declarations: [ConfirmComponent],
  imports: [CommonModule],
  exports: [ConfirmComponent],
  providers: [ConfirmService],
})
export class ConfirmModule {}
