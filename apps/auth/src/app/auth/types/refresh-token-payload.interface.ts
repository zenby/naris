import { RequestFingerprint } from './request-fingerprint.interface';
import { UserRole } from '@soer/sr-common-interfaces';

export interface RefreshTokenPayload {
  userId: number;
  userEmail: string;
  userRole: UserRole;
  fingerprint: RequestFingerprint;
}
