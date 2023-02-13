import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProfileView } from '../profile-view';

@Component({
  selector: 'soer-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  @Input() profile: ProfileView;
}
