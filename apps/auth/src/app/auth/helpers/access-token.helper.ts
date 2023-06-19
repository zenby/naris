import { Jwt } from '@soer/sr-common-interfaces';
import { AccessTokenPayload } from '../types/access-token-payload.interface';
import { BaseTokenHelper } from './base-token.helper';
import { UserEntity } from '../../user/user.entity';
import { sign } from 'jsonwebtoken';

export class AccessTokenHelper extends BaseTokenHelper<AccessTokenPayload> {
  constructor(protected readonly jwtConfig: Jwt) {
    super(jwtConfig);
  }

  generate(user: UserEntity): string {
    const payload = this.getPayload(user);
    return sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  protected getExpiration(jwtConfig: Jwt): string | number | undefined {
    return jwtConfig.expiresInAccess;
  }

  private getPayload(user: UserEntity): AccessTokenPayload {
    return {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      userRole: user.role,
    };
  }
}
