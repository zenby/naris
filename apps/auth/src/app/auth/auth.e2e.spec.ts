import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { HttpJsonResult, HttpJsonStatus } from '../common/types/http-json-result.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';

describe('Auth e2e-test', () => {
  let app: INestApplication;
  let request: ReturnType<typeof supertest>;
  let userRepo: Repository<UserEntity>;

  beforeAll(async () => {
    const configMock = {
      get: jest.fn().mockImplementation((): Configuration['jwt'] => ({
        cookieName: 'refreshToken',
        expiresInAccess: 10,
        expiresInRefresh: 10,
        jwtSecret: 'secret',
      })),
    };
    const moduleRef = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule.register({})],
      providers: [
        AuthService,
        JwtStrategy,
        UserService,
        {
          provide: ConfigService,
          useValue: configMock,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    userRepo = app.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));

    request = supertest(app.getHttpServer());
  });
  describe('POST /auth/signin', () => {
    it('recive access and refresh token', async () => {
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
        .expect('Set-Cookie', /refreshToken=.*; HttpOnly/)
        .then((response) => {
          const body: HttpJsonResult<string> = response.body;
          expect(body.status).toBe(HttpJsonStatus.Ok);
        });
    });
    it('get error if pass invalid credentials', async () => {
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
    it('user successfully created', async () => {
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
    it('get error if pass invalid data ', async () => {
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
});
