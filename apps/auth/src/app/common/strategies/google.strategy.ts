import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { UserEntity } from '../../user/user.entity';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { Profile } from 'passport';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<UserEntity | Error> {
    const { emails } = profile;
    const email = emails[0].value;

    let user = await this.userService.findByEmail(email);
    if (user instanceof NotFoundException) {
      const createUser: CreateUserDto = {
        login: email,
        email: email,
        password: '',
      };

      user = await this.userService.createOpenIdUser(createUser);
    }

    if (user instanceof Error) return user;

    done(null, user);
    return user;
  }
}
