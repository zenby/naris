import { ProfileModel } from '@soer/soer-components';
import { ProfileDto } from '@soer/sr-dto';

export const DEFAULT_VALUE = '—';

export function mapProfileDtoToModel({ email, firstName, lastName, role }: ProfileDto): ProfileModel {
  return {
    email,
    fullname: getFullname(firstName, lastName) ?? DEFAULT_VALUE,
    role,
  };
}

export function getFullname(firstName: string | null, lastName: string | null): string | null {
  if (firstName || lastName) {
    return `${firstName ?? ''} ${lastName ?? ''}`;
  }

  return null;
}
