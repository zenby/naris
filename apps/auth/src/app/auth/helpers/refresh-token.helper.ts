import { Jwt } from '@soer/sr-common-interfaces';
import { BaseTokenHelper } from './base-token.helper';
import { RefreshTokenPayload } from '../types/refresh-token-payload.interface';
import { UserEntity } from '../../user/user.entity';
import { sign } from 'jsonwebtoken';
import { RequestFingerprint } from '../types/request-fingerprint.interface';

export class RefreshTokenHelper extends BaseTokenHelper<RefreshTokenPayload> {
  constructor(protected readonly jwtConfig: Jwt) {
    super(jwtConfig);
  }

  generate(user: UserEntity, requestFingerprint: RequestFingerprint): string {
    const payload = this.getPayload(user, requestFingerprint);
    return sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  protected getExpiration(jwtConfig: Jwt): string | number | undefined {
    return jwtConfig.expiresInRefresh;
  }

  private getPayload(user: UserEntity, requestFingerprint: RequestFingerprint): RefreshTokenPayload {
    return {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      fingerprint: requestFingerprint,
    };
  }
}
