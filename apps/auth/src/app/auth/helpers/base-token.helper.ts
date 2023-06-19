import { Jwt } from '@soer/sr-common-interfaces';
import { TokenExpiredError, verify } from 'jsonwebtoken';

export abstract class BaseTokenHelper<TPayload extends object> {
  protected readonly expiresIn: string | number | undefined;
  protected readonly secret: string;

  protected constructor(protected readonly jwtConfig: Jwt) {
    this.expiresIn = this.getExpiration(jwtConfig);
    this.secret = jwtConfig.jwtSecret;
  }

  protected abstract getExpiration(jwtConfig: Jwt): string | number | undefined;

  verify(token: string): TPayload | TokenExpiredError {
    try {
      return verify(token, this.secret, { maxAge: this.expiresIn }) as TPayload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return error;
      }
      throw error;
    }
  }
}
