import { Jwt } from '@soer/sr-common-interfaces';
import { BaseTokenHelper } from './base-token.helper';
import { RefreshTokenPayload } from '../types/refresh-token-payload.interface';
import { UserEntity } from '../../user/user.entity';
import { sign } from 'jsonwebtoken';
import { Fingerprint } from './fingerprint';

export class RefreshTokenHelper extends BaseTokenHelper<RefreshTokenPayload> {
  constructor(protected readonly jwtConfig: Jwt) {
    super(jwtConfig);
  }

  generate(user: UserEntity, requestFingerprint: Fingerprint): string {
    const payload = this.getPayload(user, requestFingerprint);
    return sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  protected getExpiration(jwtConfig: Jwt): string | number | undefined {
    return jwtConfig.expiresInRefresh;
  }

  private getPayload(user: UserEntity, requestFingerprint: Fingerprint): RefreshTokenPayload {
    return {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      fingerprint: requestFingerprint,
    };
  }
}
