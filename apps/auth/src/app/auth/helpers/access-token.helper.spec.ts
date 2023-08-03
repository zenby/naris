import { adminUser } from '../../user/tests/test.users';
import { AccessTokenHelper } from './access-token.helper';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { authTestConfig } from '../tests/auth.test.config';

describe('AccessTokenHelper', () => {
  describe('generate', () => {
    it('should generate a valid token for a user with the specified secret', () => {
      const accessTokenHelper = new AccessTokenHelper(authTestConfig);
      const token = accessTokenHelper.generate(adminUser);

      expect(typeof token).toBe('string');
      expect(token).not.toBe('');
    });
  });

  describe('verify', () => {
    it('should successfully verify a valid token with the matching secret', () => {
      const accessTokenHelper = new AccessTokenHelper(authTestConfig);
      const token = accessTokenHelper.generate(adminUser);

      const result = accessTokenHelper.verify(token);

      expect(result).toBeDefined();
      expect(result).toEqual(
        expect.objectContaining({
          id: adminUser.id,
          uuid: adminUser.uuid,
          email: adminUser.email,
          userRole: adminUser.role,
        })
      );
    });

    it('should fail to verify a token with a different secret', () => {
      const wrongSecret = 'wrong_secret';
      const jwtWithWrongSecret = { ...authTestConfig, jwtSecret: wrongSecret };

      const accessTokenHelper = new AccessTokenHelper(authTestConfig);

      const wrongAccessTokenHelper = new AccessTokenHelper(jwtWithWrongSecret);
      const wrongToken = wrongAccessTokenHelper.generate(adminUser);

      expect(() => accessTokenHelper.verify(wrongToken)).toThrow(JsonWebTokenError);
    });

    it('should fail to verify an expired token', () => {
      const jwtShotTimeConfig = { ...authTestConfig, expiresInAccess: '1 second' };

      const accessTokenHelper = new AccessTokenHelper(jwtShotTimeConfig);
      const token = accessTokenHelper.generate(adminUser);

      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      const result = accessTokenHelper.verify(token);

      expect(result).toEqual(expect.objectContaining({ name: 'TokenExpiredError' }));
      expect(result).toBeInstanceOf(TokenExpiredError);

      jest.useRealTimers();
    });
  });
});
