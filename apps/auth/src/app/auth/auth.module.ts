import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../common/strategies/local.strategy';
import { UserService } from '../user/user.service';
import { RefreshCookieStrategy } from '../common/strategies/refreshCookie.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'cookie' }), JwtModule.register({})],
  providers: [AuthService, UserService, LocalStrategy, RefreshCookieStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
