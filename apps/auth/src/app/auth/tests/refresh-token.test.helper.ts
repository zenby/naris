import { Jwt } from '@soer/sr-common-interfaces';
import { RefreshTokenHelper } from '../helpers/refresh-token.helper';
import { RefreshTokenPayload } from '../types/refresh-token-payload.interface';
import { UserEntity } from '../../user/user.entity';

/*
 * Тестовый подкласс, для доступа к защищенным методам
 */
export class TestRefreshTokenHelper extends RefreshTokenHelper {
  public testGetExpiration(jwtConfig: Jwt): string | number | undefined {
    return this.getExpiration(jwtConfig);
  }

  public testGetPayload(user: UserEntity): RefreshTokenPayload {
    return this.getPayload(user);
  }
}
