import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '../../user/user.entity';
import { Profile } from 'passport';
import { AuthOpenIdService } from '../../auth-openid/auth.openid.service';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthOpenIdService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<UserEntity> {
    const { emails } = profile;
    const email = emails[0].value;

    const user = await this.authService.authByOpenID(email);

    if (user instanceof Error) {
      throw new HttpException('Authentithication error', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
