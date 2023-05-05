import * as supertest from 'supertest';
import * as cookieParser from 'cookie-parser';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { AuthTestModule, getJWTTokenForUser, expired10MinAgo } from './tests/auth.test.module';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserEntity } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { testUsers, adminUser, regularUser, regularUserCredentials } from '../user/tests/user.test.module';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/config';

describe('Auth e2e-test', () => {
  let app: INestApplication;
  let request: ReturnType<typeof supertest>;
  let userRepo: Repository<UserEntity>;
  let configService: ConfigService;
  let cookieName: string;
  let redirectUrl: string;
  let jwtSecret: string;

  const users = testUsers;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthTestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();

    userRepo = app.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    configService = app.get<ConfigService>(ConfigService);
    ({ cookieName, redirectUrl, jwtSecret } = configService.get<Configuration['jwt']>('jwt'));
    request = supertest(app.getHttpServer());
  });

  describe('POST /auth/signin', () => {
    it('should signin user when pass valid credentials', async () => {
      const validCredentials = regularUserCredentials;

      await request
        .post('/auth/signin')
        .send(validCredentials)
        .expect('Set-Cookie', new RegExp(`${cookieName}=.*; HttpOnly`))
        .expect(302)
        .expect('Location', redirectUrl);
    });

    it('should return error when pass invalid credentials', async () => {
      const invalidCredentials: LoginUserDto = {
        login: 'invalidLogin',
        password: 'invalidPassword',
      };

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
    it('should generate access token when pass valid refresh token', async () => {
      const jwtToken = await getJWTTokenForUser(users[0]);
      const response = await request
        .get('/auth/access_token')
        .set('Cookie', [`${cookieName}=${jwtToken}`])
        .expect(200);
      const body: HttpJsonResult<{ accessToken: string }> = response.body;
      const accessToken = body.items[0]?.accessToken;

      expect(body.status).toBe(HttpJsonStatus.Ok);
      expect(accessToken).toBeDefined();
    });

    it('should return 401 error when pass old refresh token', async () => {
      const jwtToken = await getJWTTokenForUser(users[0], expired10MinAgo);
      await request
        .get('/auth/access_token')
        .set('Cookie', [`${cookieName}=${jwtToken}`])
        .expect(401);
    });

    it('should return 401 error when no pass refresh token', async () => {
      await request.get('/auth/access_token').expect(401);
    });
  });

  describe('POST /auth/access_token_for_user_request', () => {
    it('should generate an access_token for requested user', async () => {
      const jwtToken = await getJWTTokenForUser(adminUser);

      const response = await request
        .post('/auth/access_token_for_user_request')
        .set('Cookie', [`${cookieName}=${jwtToken}`])
        .send({ switch_to_user_by_email: regularUser.email })
        .expect(201);

      const body: HttpJsonResult<{ accessToken: string }> = response.body;
      const accessToken = body.items[0]?.accessToken;
      const { email } = jwt.verify(accessToken, jwtSecret) as { email: string };

      expect(body.status).toBe(HttpJsonStatus.Ok);
      expect(accessToken).toBeDefined();
      expect(email).toBe(regularUser.email);
    });

    it('should return 401 error when pass old refresh token', async () => {
      const jwtToken = await getJWTTokenForUser(adminUser, expired10MinAgo);

      await request
        .post('/auth/access_token_for_user_request')
        .set('Cookie', [`${cookieName}=${jwtToken}`])
        .send({ switch_to_user_by_email: users[0].email })
        .expect(401);
    });

    it('should return 403 error when user role is USER', async () => {
      const jwtToken = await getJWTTokenForUser(regularUser);

      await request
        .post('/auth/access_token_for_user_request')
        .set('Cookie', [`${cookieName}=${jwtToken}`])
        .send({ switch_to_user_by_email: regularUser.email })
        .expect(403);
    });

    it('should return 401 error when not authorized user', async () => {
      await request
        .post('/auth/access_token_for_user_request')
        .send({ switch_to_user_by_email: users[0].email })
        .expect(401);
    });

    it('should return 404 error when no params passed', async () => {
      const jwtToken = await getJWTTokenForUser(adminUser);

      await request
        .post('/auth/access_token_for_user_request')
        .set('Cookie', [`${cookieName}=${jwtToken}`])
        .expect(404);
    });

    it('should return 404 error when empty email passed', async () => {
      const jwtToken = await getJWTTokenForUser(adminUser);

      await request
        .post('/auth/access_token_for_user_request')
        .set('Cookie', [`${cookieName}=${jwtToken}`])
        .send({ switch_to_user_by_email: '' })
        .expect(404);
    });
  });
});
