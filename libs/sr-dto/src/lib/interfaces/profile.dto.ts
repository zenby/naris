import { Role } from '@soer/soer-components';

export interface ProfileDto {
  email: string;
  expired: string;
  firstName: string | null;
  lastName: string | null;
  namespaces: any[];
  role: Role;
}
