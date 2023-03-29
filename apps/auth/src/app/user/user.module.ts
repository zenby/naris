import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { RolesGuard } from '../common/guards/roles-guard';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshCookieStrategy } from '../common/strategies/refreshCookie.strategy';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService, RolesGuard, AuthService, ConfigService, RefreshCookieStrategy],
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule.register({})],
  exports: [UserService, TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}
