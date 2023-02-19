import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { ProfileDataService } from './services/profile-data.service';
import { ProfileModule } from '@soer/soer-components';

@NgModule({
  imports: [CommonModule, ProfileModule],
  declarations: [ProfilePageComponent],
  providers: [ProfileDataService],
})
export class AccountPageModule {}
