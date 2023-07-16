import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from '../common/strategies/google.strategy';
import { YandexStrategy } from '../common/strategies/yandex.strategy';
import { AuthOpenIdController } from './auth.openid.controller';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [PassportModule, ConfigModule.forRoot()],
  controllers: [AuthOpenIdController],
  providers: [GoogleStrategy, YandexStrategy, UserService, AuthService, JwtService],
})
export class AuthOpenIdModule {}
