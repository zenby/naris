import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-yandex';
import { AuthService } from '../../auth/auth.service';
import { UserEntity } from '../../user/user.entity';
import { UserService } from '../../user/user.service';

const logger = new Logger('Yandex oauth');

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.YANDEX_CLIENT_ID,
      clientSecret: process.env.YANDEX_CLIENT_SECRET,
      callbackURL: process.env.YANDEX_CLIENT_CALLBACK,
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
