import { Jwt } from '@soer/sr-common-interfaces';
import { AccessTokenPayload } from '../types/access-token-payload.interface';
import { UserEntity } from '../../user/user.entity';
import { sign, TokenExpiredError, verify } from 'jsonwebtoken';

export class AccessTokenHelper {
  private readonly expiresIn: string | number | undefined;
  private readonly secret: string;

  constructor(jwtConfig: Jwt) {
    this.expiresIn = this.getExpiration(jwtConfig);
    this.secret = jwtConfig.jwtSecret;
  }

  generate(user: UserEntity): string {
    const payload = this.getPayload(user);
    return sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token: string): AccessTokenPayload | TokenExpiredError {
    try {
      return verify(token, this.secret, { maxAge: this.expiresIn }) as AccessTokenPayload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return error;
      }
      throw error;
    }
  }

  private getExpiration(jwtConfig: Jwt): string | number | undefined {
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
