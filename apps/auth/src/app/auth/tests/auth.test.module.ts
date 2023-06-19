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
import { testConfig } from './auth.test.config';

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
