import { Test, TestingModule } from '@nestjs/testing';
import { AuthOpenIdController } from './auth.openid.controller';
import { AuthOpenIdService } from './auth.openid.service';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('AuthOpenIdController', () => {
  let controller: AuthOpenIdController;
  let authService: AuthOpenIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthOpenIdController],
      providers: [
        {
          provide: AuthOpenIdService,
          useValue: {
            getRefreshToken: jest.fn(() => Promise.resolve('fake-refresh-token')),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => ({
              cookieName: 'fake-cookie-name',
              redirectUrl: '/fake-redirect-url',
            })),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthOpenIdController>(AuthOpenIdController);
    authService = module.get<AuthOpenIdService>(AuthOpenIdService);
  });

  describe('Google Auth', () => {
    it('should return an object with status Ok when login', async () => {
      const result = await controller.googleLogin();

      expect(result).toEqual({
        status: 'ok',
        items: [],
      });
    });

    it('should call authService.getRefreshToken, set cookie when callback then redirect', async () => {
      const response = {
        cookie: jest.fn(),
        redirect: jest.fn(),
      } as unknown as Response;
      const user = {} as UserEntity;

      await controller.googleLoginCallback(user, response);

      expect(authService.getRefreshToken).toHaveBeenCalledWith(user);
      expect(response.cookie).toHaveBeenCalledWith('fake-cookie-name', 'fake-refresh-token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      expect(response.redirect).toHaveBeenCalledWith('/fake-redirect-url');
    });

    it('should throw InternalServerErrorException on error when invalid callback', async () => {
      const user = {} as UserEntity;

      authService.getRefreshToken = jest.fn(() => {
        throw new HttpException('test exception', HttpStatus.INTERNAL_SERVER_ERROR);
      });

      await expect(controller.googleLoginCallback(user, {} as unknown as Response)).rejects.toThrowError(
        'Something went wrong. Try it later'
      );
    });
  });

  describe('Yandex Auth', () => {
    it('should return an object with status Ok when login', async () => {
      const result = await controller.yandexLogin();

      expect(result).toEqual({
        status: 'ok',
        items: [],
      });
    });

    it('should call authService.getRefreshToken and set cookie when callback', async () => {
      const user = {} as UserEntity;
      const response = {
        cookie: jest.fn(),
      } as unknown as Response;

      await controller.yandexCallback(user, response);

      expect(authService.getRefreshToken).toHaveBeenCalledWith(user);
      expect(response.cookie).toHaveBeenCalledWith('fake-cookie-name', 'fake-refresh-token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
    });

    it('should throw InternalServerErrorException on error when invalid callback', async () => {
      const user = {} as UserEntity;

      authService.getRefreshToken = jest.fn(() => {
        throw new HttpException('test exception', HttpStatus.INTERNAL_SERVER_ERROR);
      });

      await expect(controller.yandexCallback(user, {} as unknown as Response)).rejects.toThrowError(
        'Something went wrong. Try it later'
      );
    });
  });
});
