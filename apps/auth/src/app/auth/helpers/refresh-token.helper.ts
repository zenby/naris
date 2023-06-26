import { Jwt } from '@soer/sr-common-interfaces';
import { BaseTokenHelper } from './base-token.helper';
import { RefreshTokenPayload } from '../types/refresh-token-payload.interface';
import { UserEntity } from '../../user/user.entity';

export class RefreshTokenHelper extends BaseTokenHelper<RefreshTokenPayload> {
  constructor(protected readonly jwtConfig: Jwt) {
    super(jwtConfig);
  }

  protected getExpiration(jwtConfig: Jwt): string | number | undefined {
    return jwtConfig.expiresInRefresh;
  }

  protected getPayload(user: UserEntity): RefreshTokenPayload {
    return {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
    };
  }
}
