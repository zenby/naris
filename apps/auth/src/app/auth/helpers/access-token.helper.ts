import { Jwt } from '@soer/sr-common-interfaces';
import { AccessTokenPayload } from '../types/access-token-payload.interface';
import { UserEntity } from '../../user/user.entity';
import { sign } from 'jsonwebtoken';

export class AccessTokenHelper {
  private readonly secret: string;
  private readonly expiresIn: string | number | undefined;

  constructor(private readonly jwtConfig: Jwt) {
    const { jwtSecret, expiresInAccess } = jwtConfig;

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

    return sign(payload, this.secret, { expiresIn: this.expiresIn });
  }
}
