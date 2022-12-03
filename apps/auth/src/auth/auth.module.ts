import { Module } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, JwtGuard],
  controllers: [AuthController],
})
export class AuthModule {}
