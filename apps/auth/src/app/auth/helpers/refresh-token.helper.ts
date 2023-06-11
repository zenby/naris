import { Jwt } from '@soer/sr-common-interfaces';
import { RefreshTokenPayload } from '../types/refresh-token-payload.interface';
import { TokenExpiredError, sign, verify } from 'jsonwebtoken';
import { UserEntity } from '../../user/user.entity';

export class RefreshTokenHelper {
  private readonly secret: string;
  private readonly expiresIn: string | number | undefined;

  constructor(private readonly jwtConfig: Jwt) {
    const { jwtSecret, expiresInRefresh } = jwtConfig;

    this.secret = jwtSecret;
    this.expiresIn = expiresInRefresh;
  }

  generate(user: UserEntity): string {
    const payload: RefreshTokenPayload = {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
    };

    return sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token: string): RefreshTokenPayload | TokenExpiredError {
    try {
      return verify(token, this.secret, { maxAge: this.expiresIn }) as RefreshTokenPayload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return error;
      }
      throw error;
    }
  }
}
