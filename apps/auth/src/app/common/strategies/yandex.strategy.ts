import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-yandex';
import { AuthService } from '../../auth/auth.service';
import { UserEntity } from '../../user/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.YANDEX_CLIENT_ID,
      clientSecret: process.env.YANDEX_CLIENT_SECRET,
      callbackURL: process.env.YANDEX_CLIENT_CALLBACK,
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<UserEntity> {
    const email = profile['emails'][0].value;
    const user = await this.userService.findByEmail(email);
    if (user instanceof Error) {
      throw new HttpException('Authentithication error', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
