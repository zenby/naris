import { Fingerprint } from '../helpers/fingerprint';
import { UserRole } from '@soer/sr-common-interfaces';

export interface RefreshTokenPayload {
  userId: number;
  userEmail: string;
  userRole: UserRole;
  fingerprint: Fingerprint;
}
