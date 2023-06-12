import { Jwt } from '@soer/sr-common-interfaces';
import { TokenExpiredError, sign, verify } from 'jsonwebtoken';
import { UserEntity } from '../../user/user.entity';

export abstract class BaseTokenHelper<TPayload extends object> {
  private readonly expiresIn: string | number | undefined;
  private readonly secret: string;

  protected constructor(protected readonly jwtConfig: Jwt) {
    this.expiresIn = this.getExpiration(jwtConfig);
    this.secret = jwtConfig.jwtSecret;
  }

  protected abstract getExpiration(jwtConfig: Jwt): string | number | undefined;
  protected abstract getPayload(user: UserEntity): TPayload;

  generate(user: UserEntity): string {
    const payload: TPayload = this.getPayload(user);
    return sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

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
