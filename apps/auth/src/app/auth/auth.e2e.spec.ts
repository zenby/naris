import * as supertest from 'supertest';
import * as superagent from 'superagent';
import * as cookieParser from 'cookie-parser';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { AuthTestModule, expired10MinAgo } from './tests/auth.test.module';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserEntity } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  adminUser,
  regularUser,
  regularUserCredentials,
  requestFingerprint,
  testUsers,
} from '../user/tests/test.users';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/config';
import { getJWTTokenForUserWithFingerprint } from './tests/get-jwt.test.helper';

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
      await request
        .post('/auth/signin')
        .send(regularUserCredentials)
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
      const jwtToken = getJWTTokenForUserWithFingerprint(users[0], requestFingerprint);
      const authRequest = makeAuthRequest(request.get('/auth/access_token'), jwtToken);

      const response = await authRequest.expect(200);

      const body: HttpJsonResult<{ accessToken: string }> = response.body;
      const accessToken = body.items[0]?.accessToken;

      expect(body.status).toBe(HttpJsonStatus.Ok);
      expect(accessToken).toBeDefined();
    });

    it('should return 401 error when pass old refresh token', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(users[0], requestFingerprint, expired10MinAgo);
      const authRequest = makeAuthRequest(request.get('/auth/access_token'), jwtToken);

      await authRequest.expect(401);
    });

    it('should return 401 error when no pass refresh token', async () => {
      makeAuthRequest(request.get('/auth/access_token')).expect(401);
    });
  });

  describe('POST /auth/access_token_for_user_request', () => {
    it('should generate an access_token for requested user', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(adminUser, requestFingerprint);
      const authRequest = makeAuthRequest(request.post('/auth/access_token_for_user_request'), jwtToken);

      const response = await authRequest.send({ switch_to_user_by_email: regularUser.email }).expect(201);

      const body: HttpJsonResult<{ accessToken: string }> = response.body;
      const accessToken = body.items[0]?.accessToken;
      const { email } = jwt.verify(accessToken, jwtSecret) as { email: string };

      expect(body.status).toBe(HttpJsonStatus.Ok);
      expect(accessToken).toBeDefined();
      expect(email).toBe(regularUser.email);
    });

    it('should return 401 error when pass old refresh token', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(adminUser, requestFingerprint, expired10MinAgo);
      const authRequest = makeAuthRequest(request.post('/auth/access_token_for_user_request'), jwtToken);

      await authRequest.send({ switch_to_user_by_email: users[0].email }).expect(401);
    });

    it('should return 403 error when user role is USER', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(regularUser, requestFingerprint);
      const authRequest = makeAuthRequest(request.post('/auth/access_token_for_user_request'), jwtToken);

      await authRequest.send({ switch_to_user_by_email: regularUser.email }).expect(403);
    });

    it('should return 401 error when not authorized user', async () => {
      const authRequest = makeAuthRequest(request.post('/auth/access_token_for_user_request'));

      await authRequest.send({ switch_to_user_by_email: users[0].email }).expect(401);
    });

    it('should return 404 error when no params passed', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(adminUser, requestFingerprint);
      const authRequest = makeAuthRequest(request.post('/auth/access_token_for_user_request'), jwtToken);

      await authRequest.expect(404);
    });

    it('should return 404 error when empty email passed', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(adminUser, requestFingerprint);
      const authRequest = makeAuthRequest(request.post('/auth/access_token_for_user_request'), jwtToken);

      await authRequest.send({ switch_to_user_by_email: '' }).expect(404);
    });
  });

  const makeAuthRequest = <TRequest extends superagent.SuperAgentRequest>(request: TRequest, jwtToken?: string) => {
    const headers = getAuthHeaders(jwtToken);
    return request.set(headers);
  };

  const getAuthHeaders = (jwtToken?: string) => {
    const result: { [key: string]: string } = {
      'x-original-forwarded-for': requestFingerprint.ipAddresses.join(','),
      'user-agent': requestFingerprint.userAgent,
    };

    return jwtToken ? { ...result, Cookie: [`${cookieName}=${jwtToken}`] } : result;
  };
});
