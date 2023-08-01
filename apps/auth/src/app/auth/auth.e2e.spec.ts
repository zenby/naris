import * as supertest from 'supertest';
import * as cookieParser from 'cookie-parser';
import * as jwt from 'jsonwebtoken';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { AuthTestModule } from './tests/auth.test.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from '../common/strategies/local.strategy';
import { RefreshCookieStrategy } from '../common/strategies/refreshCookie.strategy';
import { testConfig } from './tests/auth.test.config';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { adminUser, regularUser, regularUserCredentials, testFingerprint, testUsers } from '../user/tests/test.users';
import { createRequest, getJWTTokenWithFingerprintFactory, authRequestMakerFactory } from './tests/auth.test.helper';
import { Fingerprint } from './helpers/fingerprint';

describe('Auth e2e-test', () => {
  let app: INestApplication;
  let request: ReturnType<typeof supertest>;

  const config = testConfig;
  const users = testUsers;
  const expired10MinAgo = -10 * 60;
  const getJWTTokenForUserWithFingerprint = getJWTTokenWithFingerprintFactory(config);
  const makeAuthRequest = authRequestMakerFactory(config.cookieName, testFingerprint);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthTestModule],
      providers: [LocalStrategy, RefreshCookieStrategy],
      controllers: [AuthController],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();

    request = supertest(app.getHttpServer());
  });

  describe('POST /auth/signin', () => {
    it('should signin user when pass valid credentials', async () => {
      await request
        .post('/auth/signin')
        .send(regularUserCredentials)
        .expect('Set-Cookie', new RegExp(`${config.cookieName}=.*; HttpOnly`))
        .expect(302)
        .expect('Location', config.redirectUrl);
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
    it('should create a user when valid data is passed', async () => {
      const newUserDto: CreateUserDto = {
        email: 'newUserEmail@example.com',
        login: 'newUserLogin',
        password: 'newUserPassword',
      };

      const response = await request.post('/auth/signup').send(newUserDto);
      const body: HttpJsonResult<string> = response.body;

      expect(body.status).toBe(HttpJsonStatus.Ok);
    });

    it('should return an error when existent user data is passed ', async () => {
      const existentUserDto: CreateUserDto = {
        email: regularUser.email,
        login: regularUser.login,
        password: regularUser.password,
      };

      const response = await request.post('/auth/signup').send(existentUserDto);
      const body: HttpJsonResult<string> = response.body;

      expect(body.status).toBe(HttpJsonStatus.Error);
    });
  });

  describe('GET /auth/signout', () => {
    it('should sign out of an account when a client requests it', async () => {
      const response = await request
        .get('/auth/signout')
        .expect(200)
        .expect('Set-Cookie', new RegExp(`${config.cookieName}=;`));
      const body: HttpJsonResult<string> = response.body;

      expect(body.status).toBe(HttpJsonStatus.Ok);
    });
  });

  describe('GET /auth/access_token', () => {
    it('should generate access token when pass valid refresh token', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(users[0], testFingerprint);
      const authRequest = makeAuthRequest(request.get('/auth/access_token'), jwtToken);

      const response = await authRequest.expect(200);

      const body: HttpJsonResult<{ accessToken: string }> = response.body;
      const accessToken = body.items[0]?.accessToken;

      expect(body.status).toBe(HttpJsonStatus.Ok);
      expect(accessToken).toBeDefined();
    });

    it('should return 401 error when pass old refresh token', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(users[0], testFingerprint, expired10MinAgo);
      const authRequest = makeAuthRequest(request.get('/auth/access_token'), jwtToken);

      await authRequest.expect(401);
    });

    it('should return 401 error when no pass refresh token', async () => {
      await makeAuthRequest(request.get('/auth/access_token')).expect(401);
    });

    it('should return 401 error when fingerprint data changed', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(users[0], testFingerprint, expired10MinAgo);
      const authRequest = makeAuthRequest(request.get('/auth/access_token'), jwtToken);

      await authRequest.expect(401);
    });
  });

  describe('POST /auth/access_token_for_user_request', () => {
    it('should generate an access_token for requested user', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(adminUser, testFingerprint);
      const authRequest = makeAuthRequest(request.post('/auth/access_token_for_user_request'), jwtToken);

      const response = await authRequest.send({ switch_to_user_by_email: regularUser.email }).expect(201);

      const body: HttpJsonResult<{ accessToken: string }> = response.body;
      const accessToken = body.items[0]?.accessToken;
      const { email } = jwt.verify(accessToken, config.jwtSecret) as { email: string };

      expect(body.status).toBe(HttpJsonStatus.Ok);
      expect(accessToken).toBeDefined();
      expect(email).toBe(regularUser.email);
    });

    it('should return 401 error when pass old refresh token', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(adminUser, testFingerprint, expired10MinAgo);
      const authRequest = makeAuthRequest(request.post('/auth/access_token_for_user_request'), jwtToken);

      await authRequest.send({ switch_to_user_by_email: users[0].email }).expect(401);
    });

    it('should return 403 error when user role is USER', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(regularUser, testFingerprint);
      const authRequest = makeAuthRequest(request.post('/auth/access_token_for_user_request'), jwtToken);

      await authRequest.send({ switch_to_user_by_email: regularUser.email }).expect(403);
    });

    it('should return 401 error when not authorized user', async () => {
      const authRequest = makeAuthRequest(request.post('/auth/access_token_for_user_request'));

      await authRequest.send({ switch_to_user_by_email: users[0].email }).expect(401);
    });

    it('should return 401 error when fingerprint data changed', async () => {
      const fingerPrint = new Fingerprint(createRequest(['127.0.0.1', '192.168.0.2'], 'Mozilla/5.0'));
      const jwtToken = getJWTTokenForUserWithFingerprint(adminUser, fingerPrint);
      const authRequest = makeAuthRequest(request.post('/auth/access_token_for_user_request'), jwtToken);

      await authRequest.send({ switch_to_user_by_email: users[0].email }).expect(401);
    });

    it('should return 404 error when no params passed', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(adminUser, testFingerprint);
      const authRequest = makeAuthRequest(request.post('/auth/access_token_for_user_request'), jwtToken);

      await authRequest.expect(404);
    });

    it('should return 404 error when empty email passed', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(adminUser, testFingerprint);
      const authRequest = makeAuthRequest(request.post('/auth/access_token_for_user_request'), jwtToken);

      await authRequest.send({ switch_to_user_by_email: '' }).expect(404);
    });
  });
});
