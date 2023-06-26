import { Jwt } from '@soer/sr-common-interfaces';
import { AccessTokenPayload } from '../types/access-token-payload.interface';
import { BaseTokenHelper } from './base-token.helper';
import { UserEntity } from '../../user/user.entity';

export class AccessTokenHelper extends BaseTokenHelper<AccessTokenPayload> {
  constructor(protected readonly jwtConfig: Jwt) {
    super(jwtConfig);
  }

  protected getExpiration(jwtConfig: Jwt): string | number | undefined {
    return jwtConfig.expiresInAccess;
  }

  protected getPayload(user: UserEntity): AccessTokenPayload {
    return {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      userRole: user.role,
    };
  }
}
