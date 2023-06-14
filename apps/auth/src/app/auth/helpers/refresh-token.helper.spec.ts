import { Jwt, UserRole } from '@soer/sr-common-interfaces';
import { TestRefreshTokenHelper } from '../tests/refresh-token.test.helper';
import { decode, JsonWebTokenError, Jwt as JwtToken, Secret, sign, TokenExpiredError } from 'jsonwebtoken';
import { UserEntity } from '../../user/user.entity';

describe('TestRefreshTokenHelper', () => {
  describe('getExpiration', () => {
    it('should return the expiration from jwtConfig', () => {
      // Arrange
      const jwtConfig: Jwt = { jwtSecret: 'test_jwt_secret', expiresInRefresh: '1 day' };
      const refreshTokenHelper = new TestRefreshTokenHelper(jwtConfig);

      // Act
      const result = refreshTokenHelper.testGetExpiration(jwtConfig);

      // Assert
      expect(result).toBe('1 day');
    });

    it('should return undefined when jwtConfig.expiresInRefresh is not specified', () => {
      // Arrange
      const jwtConfig: Jwt = {} as Jwt;
      const refreshTokenHelper = new TestRefreshTokenHelper(jwtConfig);

      // Act
      const result = refreshTokenHelper.testGetExpiration(jwtConfig);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should throw an error when jwtConfig is undefined', () => {
      // Act and Assert
      expect(() => new TestRefreshTokenHelper(undefined)).toThrow(TypeError);
    });

    it('should throw an error when jwt is undefined', () => {
      // Arrange
      const jwtConfig: Jwt = { jwtSecret: 'test_jwt_secret', expiresInRefresh: '1 day' };

      const refreshTokenHelper = new TestRefreshTokenHelper(jwtConfig);

      // Act and Assert
      expect(() => refreshTokenHelper.testGetExpiration(undefined)).toThrow(TypeError);
    });
  });

  describe('getPayload', () => {
    it('should return the payload object with user properties', () => {
      // Arrange
      const jwtConfig: Jwt = { jwtSecret: 'test_jwt_secret', expiresInRefresh: '1 day' };

      const user = new UserEntity();
      user.id = 1;
      user.email = 'test@example.com';
      user.role = UserRole.ADMIN;

      const refreshTokenHelper = new TestRefreshTokenHelper(jwtConfig);

      // Act
      const result = refreshTokenHelper.testGetPayload(user);

      // Assert
      expect(result).toEqual({
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
      });
    });

    it('should throw an error when user is undefined', () => {
      // Arrange
      const jwtConfig: Jwt = { jwtSecret: 'test_jwt_secret', expiresInRefresh: '1 day' };

      const refreshTokenHelper = new TestRefreshTokenHelper(jwtConfig);

      // Act and Assert
      expect(() => refreshTokenHelper.testGetPayload(undefined)).toThrow(TypeError);
    });
  });

  describe('generate', () => {
    it('should generate a non-empty token when user is valid', () => {
      // Arrange
      const user = new UserEntity();
      user.id = 1;
      user.email = 'test@example.com';
      user.role = UserRole.ADMIN;

      const jwtConfig: Jwt = { jwtSecret: 'test_jwt_secret', expiresInRefresh: '1 day' };

      const refreshTokenHelper = new TestRefreshTokenHelper(jwtConfig);

      // Act
      const token = refreshTokenHelper.generate(user);

      // Assert
      expect(token).not.toBe('');
      expect(typeof token).toBe('string');
    });

    it('should throw an error when jwtConfig is invalid', () => {
      // Arrange
      const user = new UserEntity();
      user.id = 1;
      user.email = 'test@example.com';
      user.role = UserRole.ADMIN;

      const jwtConfig: Jwt = { expiresInRefresh: '1 day' } as Jwt;

      const refreshTokenHelper = new TestRefreshTokenHelper(jwtConfig);

      // Assert
      expect(() => refreshTokenHelper.generate(user)).toThrow();
    });

    it('should throw an error or return null when user is null', () => {
      // Arrange
      const jwtConfig: Jwt = { jwtSecret: 'test_jwt_secret', expiresInRefresh: '1 day' };

      const refreshTokenHelper = new TestRefreshTokenHelper(jwtConfig);

      // Act and Assert
      expect(() => refreshTokenHelper.generate(null)).toThrow();
    });

    it('should throw an error when expiresInRefresh is undefined', () => {
      // Arrange
      const user = new UserEntity();
      user.id = 1;
      user.email = 'test@example.com';
      user.role = UserRole.ADMIN;

      const jwtConfig: Jwt = { jwtSecret: 'test_jwt_secret' };

      const refreshTokenHelper = new TestRefreshTokenHelper(jwtConfig);

      // Assert
      expect(() => refreshTokenHelper.generate(user)).toThrow();
    });
  });

  describe('RefreshTokenHelper', () => {
    describe('verify', () => {
      it('should return the payload object when the token is valid and not expired', () => {
        // Arrange
        const user = new UserEntity();
        user.id = 1;
        user.email = 'test@example.com';
        user.role = UserRole.ADMIN;

        const jwtConfig: Jwt = { jwtSecret: 'test_jwt_secret', expiresInRefresh: '1 day' };

        const refreshTokenHelper = new TestRefreshTokenHelper(jwtConfig);
        const token = refreshTokenHelper.generate(user);

        // Act
        const result = refreshTokenHelper.verify(token);

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
          })
        );
      });

      it('should return a TokenExpiredError when the token is expired', () => {
        // Arrange
        const user = new UserEntity();
        user.id = 1;
        user.email = 'test@example.com';
        user.role = UserRole.ADMIN;

        const jwtConfig: Jwt = { jwtSecret: 'test_jwt_secret', expiresInRefresh: '1 second' };

        const refreshTokenHelper = new TestRefreshTokenHelper(jwtConfig);
        const token = refreshTokenHelper.generate(user);

        jest.useFakeTimers();
        // Advance timers by 1 second to simulate token expiration
        jest.advanceTimersByTime(1000);

        // Act
        const result = refreshTokenHelper.verify(token);

        // Assert
        expect(result).toEqual(expect.objectContaining({ name: 'TokenExpiredError' }));
        expect(result).toBeInstanceOf(TokenExpiredError);

        jest.useRealTimers();
      });

      it('should throw an error when the token has an invalid format', () => {
        // Arrange
        const user = new UserEntity();
        user.id = 1;
        user.email = 'test@example.com';
        user.role = UserRole.ADMIN;

        const jwtConfig: Jwt = { jwtSecret: 'test_jwt_secret', expiresInRefresh: '1 day' };

        const refreshTokenHelper = new TestRefreshTokenHelper(jwtConfig);
        const token = refreshTokenHelper.generate(user);

        // Modify the token to have an invalid format
        const invalidToken = `${token}invalid_suffix`;

        // Act and Assert
        expect(() => refreshTokenHelper.verify(invalidToken)).toThrow(JsonWebTokenError);
      });

      it('should throw a JsonWebTokenError when the token has invalid data', () => {
        // Arrange
        const user = new UserEntity();
        user.id = 1;
        user.email = 'test@example.com';
        user.role = UserRole.ADMIN;

        const jwtConfig: Jwt = { jwtSecret: 'test_jwt_secret', expiresInRefresh: '1 day' };

        const refreshTokenHelper = new TestRefreshTokenHelper(jwtConfig);
        const token = refreshTokenHelper.generate(user);

        // Modify the token to remove the required field
        const modifiedToken = modifyTokenToRemoveEmailField(token);

        // Act and Assert
        expect(() => refreshTokenHelper.verify(modifiedToken)).toThrow(JsonWebTokenError);
      });

      it('should throw an error when an invalid secret key is used', () => {
        // Arrange
        const user = new UserEntity();
        user.id = 1;
        user.email = 'test@example.com';
        user.role = UserRole.ADMIN;

        const jwtConfig: Jwt = {
          jwtSecret: 'test_jwt_secret',
          expiresInRefresh: '1 day',
        };

        const refreshTokenHelper = new TestRefreshTokenHelper(jwtConfig);
        const token = refreshTokenHelper.generate(user);

        // Create a new RefreshTokenHelper instance with a different secret key
        const invalidSecretKeyRefreshTokenHelper = new TestRefreshTokenHelper({
          jwtSecret: 'invalid_jwt_secret',
          expiresInRefresh: '1 day',
        });

        // Act and Assert
        expect(() => invalidSecretKeyRefreshTokenHelper.verify(token)).toThrow(JsonWebTokenError);
      });
    });
  });
});

const modifyTokenToRemoveEmailField = (token: string): string => {
  const decodedToken: null | JwtToken = decode(token, { complete: true });

  if (decodedToken && typeof decodedToken.payload !== 'string' && decodedToken.payload.email) {
    delete decodedToken.payload.email;
  }

  return sign(decodedToken.payload, decodedToken.header.alg as Secret);
};
