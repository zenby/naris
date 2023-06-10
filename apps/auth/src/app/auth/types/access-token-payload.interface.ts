import { UserRole } from '@soer/sr-common-interfaces';

export interface AccessTokenPayload {
  id: number;
  uuid: string;
  email: string;
  userRole: UserRole;
}
