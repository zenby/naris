import { compareSync } from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Configuration } from '../config/config';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { TokenExpiredError } from 'jsonwebtoken';

import { RefreshTokenPayload } from './refresh-token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  async getAccessToken(user: UserEntity): Promise<string> {
    const { jwtSecret: secret, expiresInAccess: expiresIn } = this.configService.get<Configuration['jwt']>('jwt');

    return this.jwtService.signAsync(
      { id: user.id, uuid: user.uuid, email: user.email, userRole: user.role },
      { secret, expiresIn }
    );
  }

  async getRefreshToken(user: UserEntity | Error): Promise<string | Error> {
    if (user instanceof Error) {
      return user;
    }

    const { jwtSecret: secret, expiresInRefresh: expiresIn } = this.configService.get<Configuration['jwt']>('jwt');

    const payload: RefreshTokenPayload = {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
    };

    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async getVerifiedUserByRefreshToken(refreshToken: string): Promise<UserEntity | Error> {
    try {
      const { jwtSecret: secret, expiresInRefresh: maxAge } = this.configService.get<Configuration['jwt']>('jwt');

      const { userEmail, userId } = this.jwtService.verify<{ userId: number; userEmail: string }>(refreshToken, {
        secret,
        maxAge,
      });

      const userOrError = await this.userService.findByIdAndEmail({
        id: userId,
        email: userEmail,
      });
      if (userOrError instanceof Error) return userOrError;

      return userOrError;
    } catch (error) {
      if (error instanceof TokenExpiredError) return error;

      throw error;
    }
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
