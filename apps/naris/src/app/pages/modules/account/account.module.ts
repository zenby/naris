import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ProfileComponent } from './profile/profile.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { ProfileDataService } from './services/profile-data.service';

@NgModule({
  imports: [CommonModule, NzTypographyModule],
  declarations: [ProfileComponent, ProfilePageComponent],
  providers: [ProfileDataService],
})
export class AccountModule {}
