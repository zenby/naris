import { adminUser, testFingerprint } from '../../user/tests/test.users';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { RefreshTokenHelper } from './refresh-token.helper';
import { testConfig } from '../tests/auth.test.config';
import { Fingerprint } from './fingerprint';
import { createRequest } from '../tests/get-jwt.test.helper';
import { UnauthorizedException } from '@nestjs/common';

describe('RefreshTokenHelper', () => {
  describe('generate', () => {
    it('should generate a valid token for a user with the specified secret', () => {
      const refreshTokenHelper = new RefreshTokenHelper(testConfig);
      const token = refreshTokenHelper.generate(adminUser, testFingerprint);

      expect(typeof token).toBe('string');
      expect(token).not.toBe('');
    });
  });

  describe('verify', () => {
    it('should successfully verify a valid token with the matching secret', () => {
      const refreshTokenHelper = new RefreshTokenHelper(testConfig);
      const token = refreshTokenHelper.generate(adminUser, testFingerprint);

      const result = refreshTokenHelper.verify(token, testFingerprint);

      expect(result).toBeDefined();
      expect(result).toEqual(
        expect.objectContaining({
          userId: adminUser.id,
          userEmail: adminUser.email,
          userRole: adminUser.role,
          fingerprint: expect.any(String),
        })
      );
    });

    it('should return UnauthorizedException if the fingerprint is invalid', () => {
      const refreshTokenHelper = new RefreshTokenHelper(testConfig);
      const token = refreshTokenHelper.generate(adminUser, testFingerprint);

      const result = refreshTokenHelper.verify(
        token,
        new Fingerprint(createRequest(['127.0.0.1', '192.168.0.2'], 'Mozilla/5.0'))
      );

      expect(result).toEqual(expect.objectContaining({ name: 'UnauthorizedException' }));
      expect(result).toBeInstanceOf(UnauthorizedException);
    });

    it('should fail to verify a token with a different secret', () => {
      const wrongSecret = 'wrong_secret';
      const jwtWithWrongSecret = { ...testConfig, jwtSecret: wrongSecret };

      const refreshTokenHelper = new RefreshTokenHelper(testConfig);

      const wrongRefreshTokenHelper = new RefreshTokenHelper(jwtWithWrongSecret);
      const wrongToken = wrongRefreshTokenHelper.generate(adminUser, testFingerprint);

      expect(() => refreshTokenHelper.verify(wrongToken, testFingerprint)).toThrow(JsonWebTokenError);
    });

    it('should fail to verify an expired token', () => {
      const jwtShotTimeConfig = { ...testConfig, expiresInRefresh: '1 second' };

      const refreshTokenHelper = new RefreshTokenHelper(jwtShotTimeConfig);
      const token = refreshTokenHelper.generate(adminUser, testFingerprint);

      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      const result = refreshTokenHelper.verify(token, testFingerprint);

      expect(result).toEqual(expect.objectContaining({ name: 'TokenExpiredError' }));
      expect(result).toBeInstanceOf(TokenExpiredError);

      jest.useRealTimers();
    });
  });
});
