import { Module } from '@nestjs/common';
import { authTestConfig } from './auth.test.config';
import { UserTestModule } from '../../user/tests/user.test.module';

@Module({
  imports: [UserTestModule.forConfig(authTestConfig)],
  exports: [UserTestModule],
})
export class AuthTestModule {}
