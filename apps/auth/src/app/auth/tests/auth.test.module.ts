import { Module } from '@nestjs/common';
import { UserTestModule } from '../../user/tests/user.test.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { LocalStrategy } from '../../common/strategies/local.strategy';
import { RefreshCookieStrategy } from '../../common/strategies/refreshCookie.strategy';
import { AuthController } from '../auth.controller';
import { Configuration } from '../../config/config';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../../user/user.entity';
import { testConfig } from './auth.test.config';
import * as jwt from 'jsonwebtoken';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'cookie' }), JwtModule.register({}), UserTestModule],
  providers: [
    AuthService,
    LocalStrategy,
    RefreshCookieStrategy,
    {
      provide: ConfigService,
      useFactory: (_) => {
        return configMock;
      },
    },
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthTestModule {}

const configMock = {
  get: (): Configuration['jwt'] => testConfig,
};

export const expired10MinAgo = -10 * 60;

export async function getJWTTokenForUser(user: UserEntity, expiredInSec = 3600) {
  const { jwtSecret: secret } = testConfig;
  const iat = Math.floor(Date.now() / 1000) + expiredInSec;
  const jwtToken = jwt.sign({ userId: user.id, userEmail: user.email, iat }, secret);
  return jwtToken;
}
