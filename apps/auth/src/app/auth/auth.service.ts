import { compareSync } from 'bcrypt';
import { Injectable, Logger, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Configuration } from '../config/config';
import { ConfigService } from '@nestjs/config';

import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { TokenExpiredError } from 'jsonwebtoken';

import { AccessTokenHelper } from './helpers/access-token.helper';
import { RefreshTokenHelper } from './helpers/refresh-token.helper';
import { Fingerprint } from './helpers/fingerprint';

@Injectable()
export class AuthService {
  private readonly accessTokenHelper: AccessTokenHelper;
  private readonly refreshTokenHelper: RefreshTokenHelper;
  logger = new Logger(AuthService.name);

  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
    const jwtConfig = configService.get<Configuration['jwt']>('jwt');

    this.accessTokenHelper = new AccessTokenHelper(jwtConfig);
    this.refreshTokenHelper = new RefreshTokenHelper(jwtConfig);

    this.logger.log('Start service');
  }

  async signUp(createUserDto: CreateUserDto): Promise<UserEntity | Error> {
    const existentUser = await this.userService.findByEmail(createUserDto.email);
    if (existentUser instanceof NotFoundException) {
      return await this.userService.createUser(createUserDto);
    }

    return new BadRequestException(`User with email ${createUserDto.email} already exists`);
  }

  getAccessToken(user: UserEntity): string {
    return this.accessTokenHelper.generate(user);
  }

  getRefreshToken(user: UserEntity | Error, fingerprint: Fingerprint): string | Error {
    if (user instanceof Error) {
      return user;
    }

    return this.refreshTokenHelper.generate(user, fingerprint);
  }

  async getVerifiedUserByRefreshToken(refreshToken: string, fingerprint: Fingerprint): Promise<UserEntity | Error> {
    const verifiedToken = this.refreshTokenHelper.verify(refreshToken, fingerprint);

    if (verifiedToken instanceof TokenExpiredError) {
      return verifiedToken;
    }

    if (verifiedToken instanceof UnauthorizedException) {
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

  async authOrCreateUserByEmail(email: string): Promise<UserEntity | Error> {
    const user = await this.userService.findByEmail(email);

    if (user instanceof Error) {
      this.logger.error(user);
      const newUser = await this.userService.createUser({
        login: email,
        email,
        password: '',
      });
      return newUser;
    }

    return user;
  }

  private isPasswordMatch(password: string, userFromDb: UserEntity): boolean {
    return compareSync(password, userFromDb.password);
  }
}
