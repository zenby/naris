import { ProfileModel } from '@soer/soer-components';
import { ProfileDto } from '../../../../../../../../libs/sr-dto/src/lib/interfaces/profile.dto';

export function mapProfileDtoToModel({ email, firstName, lastName, role }: ProfileDto): ProfileModel {
  const DEFAULT_VALUE = '—';

  return {
    email,
    firstName: firstName ?? DEFAULT_VALUE,
    lastName: lastName ?? DEFAULT_VALUE,
    role,
  };
}
