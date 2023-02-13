import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileView } from '../profile-view';
import { ProfileDataService } from '../services/profile-data.service';

@Component({
  selector: 'soer-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  public profile$: Observable<ProfileView>;

  constructor(private profileDataService: ProfileDataService) {
    this.profile$ = this.profileDataService.profile$;
  }
}
