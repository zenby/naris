import * as supertest from 'supertest';
import * as cookieParser from 'cookie-parser';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';

import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { AuthModule } from './auth.module';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { Configuration } from '../config/config';
import { UserEntity } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';

describe('Auth e2e-test', () => {
  let app: INestApplication;
  let request: ReturnType<typeof supertest>;
  let userRepo: Repository<UserEntity>;

  const config: Configuration['jwt'] = {
    cookieName: 'refreshToken',
    expiresInAccess: 10,
    expiresInRefresh: 10,
    jwtSecret: 'secret',
  };

  beforeAll(async () => {
    const configMock = {
      get: jest.fn().mockImplementation((): Configuration['jwt'] => config),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .useMocker((token) => {
        if (token == ConfigService) return configMock;
        if (token == getRepositoryToken(UserEntity))
          return {
            save: jest.fn(),
            findOne: jest.fn(),
          };
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();

    userRepo = app.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));

    request = supertest(app.getHttpServer());
  });

  describe('POST /auth/signin', () => {
    it('should signin user when pass valid credentials', async () => {
      const validCredentials: LoginUserDto = {
        login: 'validLogin',
        password: 'validPassword',
      };

      const existsUser = new UserEntity();
      Object.assign(existsUser, validCredentials);
      await existsUser.hashPassword();

      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(existsUser);

      const response = await request
        .post('/auth/signin')
        .send(validCredentials)
        .expect('Set-Cookie', new RegExp(`${config.cookieName}=.*; HttpOnly`));

      const body: HttpJsonResult<string> = response.body;

      expect(body.status).toBe(HttpJsonStatus.Ok);
    });

    it('should return error when pass invalid credentials', async () => {
      const invalidCredentials: LoginUserDto = {
        login: 'invalidLogin',
        password: 'invalidPassword',
      };

      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(null);

      const response = await request.post('/auth/signin').send(invalidCredentials);
      const body: HttpJsonResult<string> = response.body;

      expect(body.status).toBe(HttpJsonStatus.Error);
    });
  });

  describe('POST /auth/signup', () => {
    it('should create user when pass valid data', async () => {
      const validDto: CreateUserDto = {
        email: 'email@example.com',
        login: 'login',
        password: 'password',
      };

      jest.spyOn(userRepo, 'save').mockResolvedValueOnce(null);

      const response = await request.post('/auth/signup').send(validDto);
      const body: HttpJsonResult<string> = response.body;

      expect(body.status).toBe(HttpJsonStatus.Ok);
    });

    it('should return error when pass invalid data ', async () => {
      const invalidDto: CreateUserDto = {
        email: 'email@example.com',
        login: 'login',
        password: 'password',
      };

      jest.spyOn(userRepo, 'save').mockRejectedValueOnce('Error');

      const response = await request.post('/auth/signup').send(invalidDto);
      const body: HttpJsonResult<string> = response.body;

      expect(body.status).toBe(HttpJsonStatus.Error);
    });
  });

  describe('GET /auth/access_token', () => {
    const existsUser = new UserEntity();
    existsUser.id = 1;
    existsUser.email = 'test@ya.ru';

    const generateRefreshToken = (expiredInSec = 3600) => {
      const iat = Math.floor(Date.now() / 1000) + expiredInSec;
      return config.cookieName + '=' + jwt.sign({ ...existsUser, iat }, config.jwtSecret);
    };

    beforeEach(() => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(existsUser);
    });

    it('should generate access token when pass valid refresh token', async () => {
      const response = await request.get('/auth/access_token').set('Cookie', [generateRefreshToken()]).expect(200);
      const body: HttpJsonResult<{ accessToken: string }> = response.body;
      const accessToken = body.items[0]?.accessToken;

      expect(body.status).toBe(HttpJsonStatus.Ok);
      expect(accessToken).toBeDefined();
    });

    it('should return 401 error when pass old refresh token', async () => {
      const expired10MinAgo = -10 * 60;

      await request.get('/auth/access_token').set('Cookie', generateRefreshToken(expired10MinAgo)).expect(401);
    });

    it('should return 401 error when no pass refresh token', async () => {
      await request.get('/auth/access_token').expect(401);
    });
  });
});
