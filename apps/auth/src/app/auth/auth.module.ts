import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../common/strategies/local.strategy';
import { RefreshCookieStrategy } from '../common/strategies/refreshCookie.strategy';
import { RefreshTokenService } from './refresh-token.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'cookie' }), JwtModule.register({}), UserModule],
  providers: [AuthService, LocalStrategy, RefreshCookieStrategy, RefreshTokenService],
  controllers: [AuthController],
})
export class AuthModule {}
