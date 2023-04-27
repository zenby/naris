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

export const config: Configuration['jwt'] = {
  cookieName: 'refreshToken',
  expiresInAccess: 10,
  expiresInRefresh: 10,
  jwtSecret: 'secret',
  redirectUrl: '/success',
};

const configMock = {
  get: (): Configuration['jwt'] => config,
};
