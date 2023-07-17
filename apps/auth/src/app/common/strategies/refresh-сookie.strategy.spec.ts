import { AuthService } from '../../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { RefreshCookieStrategy } from './refreshCookie.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../../user/user.entity';
import { Fingerprint } from '../../auth/helpers/fingerprint';
import { adminUser, testRequest } from '../../user/tests/test.users';

describe('RefreshCookieStrategy', () => {
  let strategy: RefreshCookieStrategy;
  let authService: AuthService;

  const testRefreshToken = 'testRefreshToken';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshCookieStrategy,
        {
          provide: AuthService,
          useValue: {
            getVerifiedUserByRefreshToken: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'jwt') {
                return { cookieName: 'test_cookie' };
              }
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<RefreshCookieStrategy>(RefreshCookieStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  describe('validate', () => {
    it('should return null if no refresh token', async () => {
      const refreshToken: string = null;

      const result = await strategy.validate(testRequest, refreshToken);

      expect(result).toBeNull();
    });

    it('should call authService.getVerifiedUserByRefreshToken with correct arguments', async () => {
      const user: UserEntity = {} as UserEntity;

      authService.getVerifiedUserByRefreshToken = jest.fn().mockResolvedValue(user);

      const spy = jest.spyOn(authService, 'getVerifiedUserByRefreshToken');

      await strategy.validate(testRequest, testRefreshToken);

      expect(spy).toHaveBeenCalledWith(testRefreshToken, expect.any(Fingerprint));
    });

    it('should return user if authService.getVerifiedUserByRefreshToken returns a user', async () => {
      authService.getVerifiedUserByRefreshToken = jest.fn().mockResolvedValue(adminUser);

      const result = await strategy.validate(testRequest, testRefreshToken);

      expect(result).toBe(adminUser);
    });

    it('should return null if authService.getVerifiedUserByRefreshToken returns an error', async () => {
      const error = new Error('Test error');

      authService.getVerifiedUserByRefreshToken = jest.fn().mockResolvedValue(error);

      const result = await strategy.validate(testRequest, testRefreshToken);

      expect(result).toBeNull();
    });
  });
});
