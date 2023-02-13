import { ProfileDto } from '../profile.dto';
import { ProfileView } from '../profile-view';

export function mapProfileDtoToView({ email, firstName, lastName, role }: ProfileDto): ProfileView {
  const DEFAULT_VALUE = '—';

  return {
    email,
    firstName: firstName ?? DEFAULT_VALUE,
    lastName: lastName ?? DEFAULT_VALUE,
    role,
  };
}
