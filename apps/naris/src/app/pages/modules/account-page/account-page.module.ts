import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProfilePageComponent } from './profile-page/profile-page.component';
import { ProfileDataService } from './services/profile-data.service';
import { ConfirmModule, ListModule, ProfileModule } from '@soer/soer-components';
import { ActivityJournalPageComponent } from './activity-journal-page/activity-journal-page.component';

@NgModule({
  imports: [CommonModule, ProfileModule, ListModule, ConfirmModule],
  declarations: [ProfilePageComponent, ActivityJournalPageComponent],
  providers: [ProfileDataService],
})
export class AccountPageModule {}
