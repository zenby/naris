import { Module } from '@nestjs/common';
import { UserTestModule } from '../../user/tests/user.test.module';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../config/config';
import { testConfig } from './auth.test.config';

export function getJWTConfigMock(config: Configuration['jwt']) {
  return {
    get: (): Configuration['jwt'] => config,
  };
}

@Module({
  imports: [UserTestModule],
  providers: [
    AuthService,
    {
      provide: ConfigService,
      useValue: getJWTConfigMock(testConfig),
    },
  ],
  exports: [AuthService, UserTestModule, ConfigService],
})
export class AuthTestModule {}
