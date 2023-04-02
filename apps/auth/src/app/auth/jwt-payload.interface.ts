import { UserRole } from '@soer/sr-common-interfaces';

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}
