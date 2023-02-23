import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileDataService } from '../services/profile-data.service';
import { ProfileModel } from '@soer/soer-components';

@Component({
  selector: 'soer-profile-page',
  templateUrl: './profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  public profile$: Observable<ProfileModel>;

  constructor(private profileDataService: ProfileDataService) {
    this.profile$ = this.profileDataService.profile$;
  }
}
