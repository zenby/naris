/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-yandex';
import { AuthService } from '../../auth/auth.service';
import { Configuration } from '../../config/config';
import { UserEntity } from '../../user/user.entity';

const logger = new Logger('Yandex oauth');

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(private readonly authService: AuthService, configService: ConfigService) {
    super({
      clientID: configService.get<Configuration['yandexClient']>('yandexClient').clientID,
      clientSecret: configService.get<Configuration['yandexClient']>('yandexClient').clientSecret,
      callbackURL: configService.get<Configuration['yandexClient']>('yandexClient').callbackURL,
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<UserEntity> {
    const email = profile['emails'][0].value;
    const user = await this.authService.authOrCreateUserByEmail(email);
    if (user instanceof Error) {
      logger.error(user);
      logger.error(profile);
      throw new HttpException('Authentithication error', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
