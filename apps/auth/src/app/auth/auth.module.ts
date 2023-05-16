import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../common/strategies/local.strategy';
import { RefreshCookieStrategy } from '../common/strategies/refreshCookie.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'cookie' }), JwtModule.register({}), UserModule],
  providers: [AuthService, LocalStrategy, RefreshCookieStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
