import { compareSync } from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Configuration } from '../config/config';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RefreshTokenService } from './refresh-token.service';

import { AccessTokenPayload } from './access-token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  async getAccessToken(user: UserEntity): Promise<string> {
    const { jwtSecret: secret, expiresInAccess: expiresIn } = this.configService.get<Configuration['jwt']>('jwt');

    const payload: AccessTokenPayload = {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      userRole: user.role,
    };

    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async getRefreshToken(user: UserEntity | Error): Promise<string | Error> {
    return await this.refreshTokenService.generateRefreshToken(user);
  }

  async getVerifiedUserByRefreshToken(refreshToken: string): Promise<UserEntity | Error> {
    return await this.refreshTokenService.verifyRefreshToken(refreshToken);
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
