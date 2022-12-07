import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/config';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  async getAccessToken(user: UserEntity): Promise<string> {
    const { jwtSecret: secret, expiresInAccess: expiresIn } = this.configService.get<Configuration['jwt']>('jwt');

    return await this.jwtService.signAsync({ userId: user.id, userEmail: user.email }, { secret, expiresIn });
  }
}
