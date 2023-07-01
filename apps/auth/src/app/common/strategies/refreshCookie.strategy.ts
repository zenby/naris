import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-cookie';
import { AuthService } from '../../auth/auth.service';
import { Configuration } from '../../config/config';
import { UserEntity } from '../../user/user.entity';
import { Request } from 'express';
import { Fingerprint } from '../../auth/helpers/fingerprint';

@Injectable()
export class RefreshCookieStrategy extends PassportStrategy(Strategy, 'cookie') {
  constructor(private readonly authService: AuthService, configService: ConfigService) {
    super({
      cookieName: configService.get<Configuration['jwt']>('jwt').cookieName,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, refreshToken: string): Promise<UserEntity | null> {
    if (!refreshToken) return null;

    const fingerprint = new Fingerprint(request);
    const userOrError = await this.authService.getVerifiedUserByRefreshToken(refreshToken, fingerprint);
    if (userOrError instanceof Error) return null;

    return userOrError;
  }
}
