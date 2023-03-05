import { compare } from 'bcrypt';
import { Strategy } from "passport-local";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { UserEntity } from '../../user/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({ usernameField: 'login' })
  }

  async validate(login: string, password: string): Promise<any> {
    const user = await this.userService.findByLogin({ login, password });

    if (user instanceof Error) {
      return user;
    }

    const isPasswordsMatch = await this.compareUsersByPassword(password , user);

    if (isPasswordsMatch instanceof Error) {
      return isPasswordsMatch;
    }

    return user;
  }

  async compareUsersByPassword(password, userFromDb: UserEntity): Promise<boolean | Error> {
    const isPasswordsMatch = await compare(password, userFromDb.password);

    if (!isPasswordsMatch) {
      return new UnauthorizedException('Invalid password');
    }

    return true;
  }
}
