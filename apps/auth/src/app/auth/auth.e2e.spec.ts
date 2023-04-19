import * as supertest from 'supertest';
import * as cookieParser from 'cookie-parser';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';

import { HttpJsonResult, HttpJsonStatus, UserRole } from '@soer/sr-common-interfaces';
import { AuthModule } from './auth.module';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { Configuration } from '../config/config';
import { UserEntity } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { faker } from '@faker-js/faker';

describe('Auth e2e-test', () => {
  let app: INestApplication;
  let request: ReturnType<typeof supertest>;
  let userRepo: Repository<UserEntity>;

  const adminUser = getTestUser({ role: UserRole.ADMIN });
  const users = [getTestUser({ email: 'fakeUser@mail.com' }), getTestUser(), adminUser];

  const config: Configuration['jwt'] = {
    cookieName: 'refreshToken',
    expiresInAccess: 10,
    expiresInRefresh: 10,
    jwtSecret: 'secret',
    redirectUrl: '/success',
  };

  async function getJWTTokenForUser(user: UserEntity, expiredInSec = 3600) {
    const { jwtSecret: secret } = config;
    const iat = Math.floor(Date.now() / 1000) + expiredInSec;
    const jwtToken = jwt.sign({ userId: user.id, userEmail: user.email, iat }, secret);
    return jwtToken;
  }

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
            findOne: jest.fn().mockImplementation((options) => {
              const usr = users.find((user) => {
                return user.email === options.where?.email;
              });
              return usr;
            }),
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

      await request
        .post('/auth/signin')
        .send(validCredentials)
        .expect('Set-Cookie', new RegExp(`${config.cookieName}=.*; HttpOnly`))
        .expect(302)
        .expect('Location', config.redirectUrl);
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
    it('should generate access token when pass valid refresh token', async () => {
      const jwtToken = await getJWTTokenForUser(users[0]);
      const response = await request
        .get('/auth/access_token')
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .expect(200);
      const body: HttpJsonResult<{ accessToken: string }> = response.body;
      const accessToken = body.items[0]?.accessToken;

      expect(body.status).toBe(HttpJsonStatus.Ok);
      expect(accessToken).toBeDefined();
    });

    it('should return 401 error when pass old refresh token', async () => {
      const expired10MinAgo = -10 * 60;
      const jwtToken = await getJWTTokenForUser(users[0], expired10MinAgo);
      await request
        .get('/auth/access_token')
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
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
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .send({ switch_to_user_by_email: users[0].email })
        .expect(201);

      const body: HttpJsonResult<{ accessToken: string }> = response.body;
      const accessToken = body.items[0]?.accessToken;
      const { email } = jwt.verify(accessToken, config.jwtSecret) as { email: string };

      expect(body.status).toBe(HttpJsonStatus.Ok);
      expect(accessToken).toBeDefined();
      expect(email).toBe(users[0].email);
    });

    it('should return 401 error when pass old refresh token', async () => {
      const expired10MinAgo = -10 * 60;

      const jwtToken = await getJWTTokenForUser(adminUser, expired10MinAgo);

      await request
        .post('/auth/access_token_for_user_request')
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .send({ switch_to_user_by_email: users[0].email })
        .expect(401);
    });

    it('should return 403 error when user role is USER', async () => {
      const jwtToken = await getJWTTokenForUser(users[1]);

      await request
        .post('/auth/access_token_for_user_request')
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .send({ switch_to_user_by_email: users[0].email })
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
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .expect(404);
    });

    it('should return 404 error when empty email passed', async () => {
      const jwtToken = await getJWTTokenForUser(adminUser);

      await request
        .post('/auth/access_token_for_user_request')
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .send({ switch_to_user_by_email: '' })
        .expect(404);
    });
  });

  type UserInfo = {
    id?: number;
    login?: string;
    email?: string;
    role?: UserRole;
  };

  function getTestUser(userInfo: UserInfo = { id: undefined, login: undefined, email: undefined, role: undefined }) {
    const user = new UserEntity();
    Object.assign(user, {
      id: userInfo.id ?? faker.random.numeric(),
      login: userInfo.login ?? faker.internet.userName(),
      email: userInfo.email ?? faker.internet.email(),
      uuid: faker.datatype.uuid(),
      role: userInfo.role ?? UserRole.USER,
    });
    return user;
  }
});
