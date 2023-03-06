import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from '../common/strategies/google.strategy';
import { AuthOpenIdController } from './auth.openid.controller';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthOpenIdService } from './auth.openid.service';

@Module({
  imports: [PassportModule, ConfigModule.forRoot()],
  controllers: [AuthOpenIdController],
  providers: [GoogleStrategy, UserService, AuthOpenIdService, JwtService],
})
export class AuthOpenIdModule {}
