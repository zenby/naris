import { adminUser } from '../../user/tests/test.users';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { RefreshTokenHelper } from './refresh-token.helper';
import { testConfig } from '../tests/auth.test.config';

describe('RefreshTokenHelper', () => {
  describe('generate', () => {
    it('should generate a valid token for a user with the specified secret', () => {
      const refreshTokenHelper = new RefreshTokenHelper(testConfig);
      const token = refreshTokenHelper.generate(adminUser);

      expect(typeof token).toBe('string');
      expect(token).not.toBe('');
    });
  });

  describe('verify', () => {
    it('should successfully verify a valid token with the matching secret', () => {
      const refreshTokenHelper = new RefreshTokenHelper(testConfig);
      const token = refreshTokenHelper.generate(adminUser);

      const result = refreshTokenHelper.verify(token);

      expect(result).toBeDefined();
      expect(result).toEqual(
        expect.objectContaining({
          userId: adminUser.id,
          userEmail: adminUser.email,
          userRole: adminUser.role,
        })
      );
    });

    it('should fail to verify a token with a different secret', () => {
      const wrongSecret = 'wrong_secret';
      const jwtWithWrongSecret = { ...testConfig, jwtSecret: wrongSecret };

      const refreshTokenHelper = new RefreshTokenHelper(testConfig);

      const wrongRefreshTokenHelper = new RefreshTokenHelper(jwtWithWrongSecret);
      const wrongToken = wrongRefreshTokenHelper.generate(adminUser);

      expect(() => refreshTokenHelper.verify(wrongToken)).toThrow(JsonWebTokenError);
    });

    it('should fail to verify an expired token', () => {
      const jwtShotTimeConfig = { ...testConfig, expiresInRefresh: '1 second' };

      const refreshTokenHelper = new RefreshTokenHelper(jwtShotTimeConfig);
      const token = refreshTokenHelper.generate(adminUser);

      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      const result = refreshTokenHelper.verify(token);

      expect(result).toEqual(expect.objectContaining({ name: 'TokenExpiredError' }));
      expect(result).toBeInstanceOf(TokenExpiredError);

      jest.useRealTimers();
    });
  });
});
