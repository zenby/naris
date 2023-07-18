import { Jwt } from '@soer/sr-common-interfaces';
import { RefreshTokenPayload } from '../types/refresh-token-payload.interface';
import { UserEntity } from '../../user/user.entity';
import { sign, TokenExpiredError, verify } from 'jsonwebtoken';
import { Fingerprint } from './fingerprint';
import { Logger, UnauthorizedException } from '@nestjs/common';

const logger = new Logger('Fingerprint');

export class RefreshTokenHelper {
  private readonly expiresIn: string | number | undefined;
  private readonly secret: string;

  constructor(jwtConfig: Jwt) {
    this.expiresIn = this.getExpiration(jwtConfig);
    this.secret = jwtConfig.jwtSecret;
  }

  generate(user: UserEntity, requestFingerprint: Fingerprint): string {
    const payload = this.getPayload(user, requestFingerprint);
    return sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(
    token: string,
    requestFingerprint: Fingerprint
  ): RefreshTokenPayload | TokenExpiredError | UnauthorizedException {
    try {
      const result = verify(token, this.secret, { maxAge: this.expiresIn }) as RefreshTokenPayload;
      const isValidFingerprint = result.fingerprint === requestFingerprint.toString();

      if (!isValidFingerprint) {
        logger.error('Invalid fingerprint' + JSON.stringify(result));
        return new UnauthorizedException('Invalid fingerprint');
      }

      return result;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return error;
      }
      throw error;
    }
  }

  private getExpiration(jwtConfig: Jwt): string | number | undefined {
    return jwtConfig.expiresInRefresh;
  }

  private getPayload(user: UserEntity, requestFingerprint: Fingerprint): RefreshTokenPayload {
    return {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      fingerprint: requestFingerprint.toString(),
    };
  }
}
