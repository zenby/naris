import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Configuration } from '../../config/config';
import { RefreshTokenPayload } from '../types/refresh-token-payload.interface';
import { TokenExpiredError } from 'jsonwebtoken';
import { UserEntity } from '../../user/user.entity';

export class RefreshTokenHelper {
  private readonly secret: string;
  private readonly expiresIn: string | number | undefined;

  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {
    const { jwtSecret, expiresInRefresh } = configService.get<Configuration['jwt']>('jwt');

    this.secret = jwtSecret;
    this.expiresIn = expiresInRefresh;
  }

  async generate(user: UserEntity): Promise<string> {
    const payload: RefreshTokenPayload = {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
    };

    return await this.jwtService.signAsync(payload, { secret: this.secret, expiresIn: this.expiresIn });
  }

  verify(token: string): RefreshTokenPayload | TokenExpiredError {
    try {
      return this.jwtService.verify<RefreshTokenPayload>(token, { secret: this.secret, maxAge: this.expiresIn });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return error;
      }
      throw error;
    }
  }
}
