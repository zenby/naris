import { Role } from '@soer/soer-components';

export interface ProfileDto {
  email: string;
  expired: Date;
  firstName: string | null;
  lastName: string | null;
  namespaces: any[];
  role: Role;
}
