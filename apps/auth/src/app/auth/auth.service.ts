import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/config';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  async getAccessToken(token: string): Promise<string> {
    const { jwtSecret: secret, expiresInAccess: expiresIn } = this.configService.get<Configuration['jwt']>('jwt');

    const decoded = await this.jwtService.verifyAsync(token, {
      secret,
    });

    return await this.jwtService.signAsync({ userId: decoded.id, userEmail: decoded.email }, { secret, expiresIn });
  }
}
