import { DynamicModule, Module } from '@nestjs/common';
import { UserTestRepository } from './user.test.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { UserService } from '../user.service';
import { AuthService } from '../../auth/auth.service';
import { RefreshCookieStrategy } from '../../common/strategies/refreshCookie.strategy';
import { ConfigService } from '@nestjs/config';
import { Test } from 'supertest';
import { createUserAuthRequestFactory, getJWTConfigMock } from '../../auth/tests/auth.test.helper';
import { adminUser, regularUser, testFingerprint } from './test.users';
import { Configuration } from '../../config/config';

@Module({})
export class UserTestModule {
  static forConfig(config: Configuration['jwt']): DynamicModule {
    return {
      module: UserTestModule,
      providers: [
        AuthService,
        UserService,
        UserTestRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: UserTestRepository,
        },
        RefreshCookieStrategy,
        {
          provide: ConfigService,
          useValue: getJWTConfigMock(config),
        },
        {
          provide: 'makeAdminAuthRequest',
          useValue: (req: Test) => createUserAuthRequestFactory(config, testFingerprint)(req, adminUser),
        },
        {
          provide: 'makeRegularAuthRequest',
          useValue: (req: Test) => createUserAuthRequestFactory(config, testFingerprint)(req, regularUser),
        },
      ],
      exports: [AuthService, ConfigService, UserTestRepository, UserService],
    };
  }
}
