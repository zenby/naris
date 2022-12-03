import { Module } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

// TODO: need env & config
@Module({
  imports: [
    JwtModule.register({
      secret: 'Some random key here',
      signOptions: {
        expiresIn: 60 * 15, // 15 min
      },
    }),
  ],
  providers: [AuthService, JwtGuard],
  controllers: [AuthController],
})
export class AuthModule {}
