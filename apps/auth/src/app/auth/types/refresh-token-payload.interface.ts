import { UserRole } from '@soer/sr-common-interfaces';

export interface RefreshTokenPayload {
  userId: number;
  userEmail: string;
  userRole: UserRole;
  fingerprint?: string;
}
