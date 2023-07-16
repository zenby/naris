import { Test, TestingModule } from '@nestjs/testing';
import { AuthOpenIdController } from './auth.openid.controller';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../auth/auth.service';

const fingerprint = {
  ipAddresses: ['10.10.0.1'],
  userAgent: 'test',
};

const request = {
  headers: {
    'x-original-forwarded-for': fingerprint.ipAddresses,
    'user-agent': fingerprint.userAgent,
  },
} as unknown as Request;

describe('AuthOpenIdController', () => {
  let controller: AuthOpenIdController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthOpenIdController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getRefreshToken: jest.fn(() => 'fake-refresh-token'),
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
    authService = module.get<AuthService>(AuthService);
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

      await controller.googleLoginCallback(user, request, response);

      expect(authService.getRefreshToken).toHaveBeenCalledWith(user, fingerprint);
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

      await expect(controller.googleLoginCallback(user, request, {} as unknown as Response)).rejects.toThrowError(
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

    it('should call authService.getRefreshToken, set cookie when callback then redirect', async () => {
      const user = {} as UserEntity;
      const response = {
        cookie: jest.fn(),
        redirect: jest.fn(),
      } as unknown as Response;
      await controller.yandexCallback(user, request, response);

      expect(authService.getRefreshToken).toHaveBeenCalledWith(user, fingerprint);
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

      await expect(controller.yandexCallback(user, request, {} as unknown as Response)).rejects.toThrowError(
        'Something went wrong. Try it later'
      );
    });
  });
});
