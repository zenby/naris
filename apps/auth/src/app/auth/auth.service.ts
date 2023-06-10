import { compareSync } from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { TokenExpiredError } from 'jsonwebtoken';

import { AccessTokenHelper } from './helpers/access-token.helper';
import { RefreshTokenHelper } from './helpers/refresh-token.helper';

@Injectable()
export class AuthService {
  private readonly accessTokenHelper: AccessTokenHelper;
  private readonly refreshTokenHelper: RefreshTokenHelper;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    this.accessTokenHelper = new AccessTokenHelper(configService, jwtService);
    this.refreshTokenHelper = new RefreshTokenHelper(configService, jwtService);
  }

  async signUp(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  async getAccessToken(user: UserEntity): Promise<string> {
    return await this.accessTokenHelper.generate(user);
  }

  async getRefreshToken(user: UserEntity | Error): Promise<string | Error> {
    if (user instanceof Error) {
      return user;
    }

    return await this.refreshTokenHelper.generate(user);
  }

  async getVerifiedUserByRefreshToken(refreshToken: string): Promise<UserEntity | Error> {
    const verifiedToken = await this.refreshTokenHelper.verify(refreshToken);

    if (verifiedToken instanceof TokenExpiredError) {
      return verifiedToken;
    }

    const { userId, userEmail } = verifiedToken;

    const userOrError = await this.userService.findByIdAndEmail({
      id: userId,
      email: userEmail,
    });

    if (userOrError instanceof Error) {
      return userOrError;
    }

    return userOrError;
  }

  async validateUser(login: string, password: string): Promise<UserEntity | Error> {
    const user = await this.userService.findByLogin(login);

    if (user instanceof Error) {
      return user;
    }

    return this.isPasswordMatch(password, user) ? user : new UnauthorizedException('Invalid password');
  }

  private isPasswordMatch(password: string, userFromDb: UserEntity): boolean {
    return compareSync(password, userFromDb.password);
  }
}
