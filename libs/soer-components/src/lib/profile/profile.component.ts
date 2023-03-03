import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProfileModel } from './profile.model';

@Component({
  selector: 'soer-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  @Input() profile!: ProfileModel;
}
