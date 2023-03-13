import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, NzTypographyModule],
  exports: [ProfileComponent],
})
export class ProfileModule {}
