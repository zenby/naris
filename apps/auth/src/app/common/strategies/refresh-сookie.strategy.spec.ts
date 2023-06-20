import { AuthService } from '../../auth/auth.service';
import { adminUser } from '../../user/tests/test.users';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserEntity } from '../../user/user.entity';
import { FingerprintRequestHelper } from '../../auth/helpers/fingerprint-request.helper';
import { RefreshCookieStrategy } from './refreshCookie.strategy';
import { RequestFingerprint } from '../../auth/types/request-fingerprint.interface';

describe('RefreshCookieStrategy', () => {
  let refreshCookieStrategy: RefreshCookieStrategy;
  let authServiceMock: Partial<AuthService>;
  let configServiceMock: Partial<ConfigService>;
  let request: Request;
  let fingerprintRequestHelperMock: FingerprintRequestHelper;
  let extractRequestFingerprintMock: jest.Mock;

  beforeEach(() => {
    authServiceMock = {
      getVerifiedUserByRefreshToken: jest.fn(),
    };

    configServiceMock = {
      get: jest.fn((key: string) => {
        if (key === 'jwt') {
          return { cookieName: 'test_cookie' };
        }
        return undefined;
      }),
    };

    request = {} as Request;

    extractRequestFingerprintMock = jest.fn();

    fingerprintRequestHelperMock = {
      extractRequestFingerprint: extractRequestFingerprintMock,
    } as unknown as FingerprintRequestHelper;

    refreshCookieStrategy = new RefreshCookieStrategy(
      authServiceMock as AuthService,
      configServiceMock as ConfigService
    );
    (
      refreshCookieStrategy as unknown as { fingerprintRequestHelper: FingerprintRequestHelper }
    ).fingerprintRequestHelper = fingerprintRequestHelperMock;
  });

  describe('validate', () => {
    it('should return user entity if refresh token is valid', async () => {
      const refreshToken = 'valid_refresh_token';
      const expectedUser: UserEntity = adminUser;
      const expectedRequestFingerprint = {};

      extractRequestFingerprintMock.mockReturnValue(expectedRequestFingerprint);
      authServiceMock.getVerifiedUserByRefreshToken = jest.fn().mockResolvedValue(expectedUser);

      const result = await refreshCookieStrategy.validate(request, refreshToken);
      expect(result).toEqual(expectedUser);
      expect(authServiceMock.getVerifiedUserByRefreshToken).toHaveBeenCalledWith(
        refreshToken,
        expectedRequestFingerprint
      );
      expect(extractRequestFingerprintMock).toHaveBeenCalledWith(request);
    });

    it('should return null if refresh token is not provided', async () => {
      const refreshToken = '';

      const result = await refreshCookieStrategy.validate(request, refreshToken);
      expect(result).toBeNull();
      expect(fingerprintRequestHelperMock.extractRequestFingerprint).not.toHaveBeenCalled();
      expect(authServiceMock.getVerifiedUserByRefreshToken).not.toHaveBeenCalled();
    });

    it('should return null if refresh token is invalid', async () => {
      const refreshToken = 'invalid_refresh_token';
      const expectedRequestFingerprint: RequestFingerprint = {
        ipAddresses: ['127.0.0.1'],
        userAgent: 'Test User Agent',
      };

      fingerprintRequestHelperMock.extractRequestFingerprint = jest.fn().mockReturnValue(expectedRequestFingerprint);
      authServiceMock.getVerifiedUserByRefreshToken = jest.fn().mockResolvedValue(new Error('Invalid refresh token'));

      const result = await refreshCookieStrategy.validate(request, refreshToken);
      expect(result).toBeNull();
      expect(authServiceMock.getVerifiedUserByRefreshToken).toHaveBeenCalledWith(
        refreshToken,
        expect.objectContaining({
          ipAddresses: expect.any(Array),
          userAgent: expect.any(String),
        })
      );
      expect(fingerprintRequestHelperMock.extractRequestFingerprint).toHaveBeenCalledWith(request);
    });
  });
});
