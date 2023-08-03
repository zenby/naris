import { Test, TestingModule } from '@nestjs/testing';
import { AuthOpenIdController } from './auth.openid.controller';
import { UserEntity } from '../user/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { HttpJsonStatus } from '@soer/sr-common-interfaces';
import { userFactory } from '../auth/tests/auth.test.helper';
import { authTestConfig } from '../auth/tests/auth.test.config';
import { AuthTestModule } from '../auth/tests/auth.test.module';
import { regularUser, testRequest, testFingerprint } from '../user/tests/test.users';

describe('AuthOpenIdController', () => {
  let controller: AuthOpenIdController;
  let authService: AuthService;
  const internalErrorMessage = 'Something went wrong. Try it later';
  const config = authTestConfig;
  const request = testRequest;
  const userTokenGenerator = userFactory(config);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthTestModule],
      controllers: [AuthOpenIdController],
    }).compile();

    controller = module.get<AuthOpenIdController>(AuthOpenIdController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('Google Auth', () => {
    it('should return an object with status Ok when login', async () => {
      const result = await controller.googleLogin();

      expect(result).toEqual({
        status: HttpJsonStatus.Ok,
        items: [],
      });
    });

    it('should call authService.getRefreshToken, set cookie when callback then redirect', async () => {
      const response = {
        cookie: jest.fn(),
        redirect: jest.fn(),
      } as unknown as Response;

      const jwtToken = userTokenGenerator(regularUser, testFingerprint);
      const refreshSpy = jest.spyOn(authService, 'getRefreshToken');

      await controller.googleLoginCallback(regularUser, request, response);

      expect(refreshSpy).toHaveBeenCalledWith(regularUser, testFingerprint);
      expect(response.cookie).toHaveBeenCalledWith(config.cookieName, jwtToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      expect(response.redirect).toHaveBeenCalledWith(config.redirectUrl);
    });

    it('should throw InternalServerErrorException on error when invalid callback', async () => {
      const user = {} as UserEntity;

      authService.getRefreshToken = jest.fn(() => {
        throw new HttpException('test exception', HttpStatus.INTERNAL_SERVER_ERROR);
      });

      await expect(controller.googleLoginCallback(user, request, {} as unknown as Response)).rejects.toThrowError(
        internalErrorMessage
      );
    });
  });

  describe('Yandex Auth', () => {
    it('should return an object with status Ok when login', async () => {
      const result = await controller.yandexLogin();

      expect(result).toEqual({
        status: HttpJsonStatus.Ok,
        items: [],
      });
    });

    it('should call authService.getRefreshToken, set cookie when callback then redirect', async () => {
      const response = {
        cookie: jest.fn(),
        redirect: jest.fn(),
      } as unknown as Response;
      const jwtToken = userTokenGenerator(regularUser, testFingerprint);
      const refreshSpy = jest.spyOn(authService, 'getRefreshToken');

      await controller.yandexCallback(regularUser, request, response);

      expect(refreshSpy).toHaveBeenCalledWith(regularUser, testFingerprint);
      expect(response.cookie).toHaveBeenCalledWith(config.cookieName, jwtToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      expect(response.redirect).toHaveBeenCalledWith(config.redirectUrl);
    });

    it('should throw InternalServerErrorException on error when invalid callback', async () => {
      const user = {} as UserEntity;

      authService.getRefreshToken = jest.fn(() => {
        throw new HttpException('test exception', HttpStatus.INTERNAL_SERVER_ERROR);
      });

      await expect(controller.yandexCallback(user, request, {} as unknown as Response)).rejects.toThrowError(
        internalErrorMessage
      );
    });
  });
});
