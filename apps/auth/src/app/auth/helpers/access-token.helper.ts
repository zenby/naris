import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Configuration } from '../../config/config';
import { AccessTokenPayload } from '../types/access-token-payload.interface';
import { UserEntity } from '../../user/user.entity';

export class AccessTokenHelper {
  private readonly secret: string;
  private readonly expiresIn: string | number | undefined;

  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {
    const { jwtSecret, expiresInAccess } = configService.get<Configuration['jwt']>('jwt');

    this.secret = jwtSecret;
    this.expiresIn = expiresInAccess;
  }

  async generate(user: UserEntity): Promise<string> {
    const payload: AccessTokenPayload = {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      userRole: user.role,
    };

    return await this.jwtService.signAsync(payload, { secret: this.secret, expiresIn: this.expiresIn });
  }
}
