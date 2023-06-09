import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/config';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { RefreshTokenPayload } from './refresh-token-payload.interface';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  async generateRefreshToken(user: UserEntity | Error): Promise<string | Error> {
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

  async verifyRefreshToken(refreshToken: string): Promise<UserEntity | Error> {
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
}
