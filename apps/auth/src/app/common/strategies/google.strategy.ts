import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
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

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<UserEntity | Error> {
    const { emails } = profile;
    const email = emails[0].value;

    const user = await this.authService.authByOpenID(email);

    if (user instanceof Error) {
      done(user, undefined);
      return user;
    }

    done(null, user);
    return user;
  }
}
