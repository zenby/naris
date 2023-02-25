import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthModule } from './auth.module';
import * as jwt from 'jsonwebtoken';
import * as cookieParser from 'cookie-parser';

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

      return request
        .post('/auth/signin')
        .send(validCredentials)
        .expect('Set-Cookie', new RegExp(`${config.cookieName}=.*; HttpOnly`))
        .then((response) => {
          const body: HttpJsonResult<string> = response.body;
          expect(body.status).toBe(HttpJsonStatus.Ok);
        });
    });
    it('should return error when pass invalid credentials', async () => {
      const invalidCredentials: LoginUserDto = {
        login: 'invalidLogin',
        password: 'invalidPassword',
      };

      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(null);

      return request
        .post('/auth/signin')
        .send(invalidCredentials)
        .then((response) => {
          const body: HttpJsonResult<string> = response.body;
          expect(body.status).toBe(HttpJsonStatus.Error);
        });
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

      return request
        .post('/auth/signup')
        .send(validDto)
        .then((response) => {
          const body: HttpJsonResult<string> = response.body;
          expect(body.status).toBe(HttpJsonStatus.Ok);
        });
    });
    it('should return error when pass invalid data ', async () => {
      const invalidDto: CreateUserDto = {
        email: 'email@example.com',
        login: 'login',
        password: 'password',
      };

      jest.spyOn(userRepo, 'save').mockRejectedValueOnce('Error');

      return request
        .post('/auth/signup')
        .send(invalidDto)
        .then((response) => {
          const body: HttpJsonResult<string> = response.body;
          expect(body.status).toBe(HttpJsonStatus.Error);
        });
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

    it('should generate access token when pass valid refresh token', () => {
      return request
        .get('/auth/access_token')
        .set('Cookie', [generateRefreshToken()])
        .then((response) => {
          const body: HttpJsonResult<{ accessToken: string }> = response.body;
          expect(body.status).toBe(HttpJsonStatus.Ok);
          const accessToken = body.items[0]?.accessToken;
          expect(accessToken).toBeDefined();
        });
    });
    it('should return 401 error when pass old refresh token', () => {
      const expired10MinAgo = -10 * 60;
      return request.get('/auth/access_token').set('Cookie', generateRefreshToken(expired10MinAgo)).expect(401);
    });
    it('should return 401 error when no pass refresh token', () => {
      return request.get('/auth/access_token').expect(401);
    });
  });
});
