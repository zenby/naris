import { Module } from '@nestjs/common';
import { UserTestModule } from '../../user/tests/user.test.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { LocalStrategy } from '../../common/strategies/local.strategy';
import { RefreshCookieStrategy } from '../../common/strategies/refreshCookie.strategy';
import { AuthController } from '../auth.controller';
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'cookie' }), JwtModule.register({}), UserTestModule],
  providers: [AuthService, LocalStrategy, RefreshCookieStrategy],
  controllers: [AuthController],
  exports: [],
})
export class AuthTestModule {}
