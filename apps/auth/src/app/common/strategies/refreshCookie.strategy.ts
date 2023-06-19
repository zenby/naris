import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-cookie';
import { AuthService } from '../../auth/auth.service';
import { Configuration } from '../../config/config';
import { UserEntity } from '../../user/user.entity';
import { Request } from 'express';
import { FingerprintRequestHelper } from '../../auth/helpers/fingerprint-request.helper';

@Injectable()
export class RefreshCookieStrategy extends PassportStrategy(Strategy, 'cookie') {
  private readonly fingerprintRequestHelper: FingerprintRequestHelper;

  constructor(private readonly authService: AuthService, configService: ConfigService) {
    super({
      cookieName: configService.get<Configuration['jwt']>('jwt').cookieName,
      passReqToCallback: true,
    });

    this.fingerprintRequestHelper = new FingerprintRequestHelper();
  }

  async validate(request: Request, refreshToken: string): Promise<UserEntity | null> {
    if (!refreshToken) return null;

    const requestFingerprint = this.fingerprintRequestHelper.extractRequestFingerprint(request);
    const userOrError = await this.authService.getVerifiedUserByRefreshToken(refreshToken, requestFingerprint);
    if (userOrError instanceof Error) return null;

    return userOrError;
  }
}
