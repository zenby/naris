import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import cookieParser = require('cookie-parser');
import * as supertest from 'supertest';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { faker } from '@faker-js/faker';
import { UserInfoDto } from './dto/user-info-dto';
import { UserTestModule } from './tests/user.test.module';
import { testUsers, adminUser, regularUser } from '../user/tests/user.test.module';
import { AuthService } from '../auth/auth.service';
import { RefreshCookieStrategy } from '../common/strategies/refreshCookie.strategy';
import { UserController } from './user.controller';
import { testConfig } from '../auth/tests/auth.test.config';
import { getJWTConfigMock } from '../auth/tests/auth.test.module';
import { getJWTTokenWithFingerprintFactory, authRequestMakerFactory } from '../auth/tests/auth.test.helper';
import { testFingerprint } from './tests/test.users';

describe('user controller e2e tests', () => {
  let app: INestApplication;
  let request: ReturnType<typeof supertest>;
  let userRepo: Repository<UserEntity>;

  const config = testConfig;
  const getJWTTokenForUserWithFingerprint = getJWTTokenWithFingerprintFactory(config);
  const makeAuthRequest = authRequestMakerFactory(config.cookieName, testFingerprint);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserTestModule],
      providers: [
        AuthService,
        RefreshCookieStrategy,
        {
          provide: ConfigService,
          useValue: getJWTConfigMock(config),
        },
      ],
      controllers: [UserController],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();

    userRepo = app.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    request = supertest(app.getHttpServer());
  });

  describe('GET /users', () => {
    const users = testUsers;

    function isUserEntity(arg: object): arg is UserEntity[] {
      return arg && Array.isArray(arg) && arg[0].email && typeof arg[0].email == 'string';
    }

    it('should return a list of users when user is an admin', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(adminUser, testFingerprint);
      const authRequest = makeAuthRequest(request.get('/users'), jwtToken);

      const response = await authRequest.send().expect(200);

      const body: HttpJsonResult<UserEntity> = response.body;

      expect(body.items.length == users.length);
      expect(isUserEntity(body.items)).toBeTruthy;
    });

    it('should return 403 error when user not an admin', async () => {
      const jwtToken = getJWTTokenForUserWithFingerprint(regularUser, testFingerprint);
      const authRequest = makeAuthRequest(request.get('/users'), jwtToken);

      await authRequest.send().expect(403);
    });

    it('should return 401 error when not authorized', async () => {
      await request.get('/users').send().expect(401);
    });
  });

  describe('DELETE /user/id', () => {
    it('should return ok status when user deleted by an admin', async () => {
      const userToDelete = regularUser;

      const jwtToken = getJWTTokenForUserWithFingerprint(adminUser, testFingerprint);
      const userRepositoryDeleteSpy = jest.spyOn(userRepo, 'delete');

      const authRequest = makeAuthRequest(request.delete(`/user/${userToDelete.id}`), jwtToken);
      const response = await authRequest.send().expect(200);

      const body: HttpJsonResult<DeleteResult> = response.body;

      expect(userRepositoryDeleteSpy).toHaveBeenCalledWith({ id: `${userToDelete.id}` });
      expect(body.status == 'ok').toBeTruthy;
    });

    it('should return 403 error when user not an admin', async () => {
      const user = regularUser;
      const userToDelete = testUsers[1];

      const jwtToken = getJWTTokenForUserWithFingerprint(user, testFingerprint);

      const authRequest = makeAuthRequest(request.delete(`/user/${userToDelete.id}`), jwtToken);

      await authRequest.send().expect(403);
    });

    it('should return 401 error when not authorized', async () => {
      const userToDelete = regularUser;

      await request.delete(`/user/${userToDelete.id}`).send().expect(401);
    });
  });

  describe('PUT /user/id', () => {
    it('should block user when user blocked by an admin', async () => {
      const userId = faker.random.numeric();

      const jwtToken = getJWTTokenForUserWithFingerprint(adminUser, testFingerprint);

      const updateSpy = jest.spyOn(userRepo, 'update');

      const authRequest = makeAuthRequest(request.put(`/user/${userId}`), jwtToken);
      await authRequest.send({ isBlocked: true }).expect(200);

      expect(updateSpy).toHaveBeenCalledWith({ id: userId }, { isBlocked: true });
    });

    it('should block user when user unblocked by an admin', async () => {
      const userId = faker.random.numeric();

      const updateSpy = jest.spyOn(userRepo, 'update');

      const jwtToken = getJWTTokenForUserWithFingerprint(adminUser, testFingerprint);
      const authRequest = makeAuthRequest(request.put(`/user/${userId}`), jwtToken);

      await authRequest.send({ isBlocked: false }).expect(200);
      expect(updateSpy).toHaveBeenCalledWith({ id: userId }, { isBlocked: false });
    });
  });

  describe('PUT user/:uuid/profile', () => {
    it('should return 401 error if not authorized', async () => {
      const userInfo: UserInfoDto = { firstName: 'test', lastName: 'test' };

      await request.put(`/user/${faker.datatype.uuid()}/profile`).send(userInfo).expect(401);
    });

    it('should edit the profile if the user uuid differs but the editor is an admin', async () => {
      const wrongId = faker.datatype.uuid();
      const userInfo: UserInfoDto = { firstName: 'test', lastName: 'test' };

      const jwtToken = getJWTTokenForUserWithFingerprint(adminUser, testFingerprint);

      const authRequest = makeAuthRequest(request.put(`/user/${wrongId}/profile`), jwtToken);
      const response = await authRequest.send(userInfo);

      const body = response.body;

      expect(body.status).toBe(HttpJsonStatus.Ok);
    });

    it('should edit the profile if the user is an owner of the profile (matches by uuid)', async () => {
      const userInfo: UserInfoDto = { firstName: 'firstname', lastName: 'lastname' };

      const jwtToken = getJWTTokenForUserWithFingerprint(regularUser, testFingerprint);

      const updateSpy = jest.spyOn(userRepo, 'update');

      const authRequest = makeAuthRequest(request.put(`/user/${regularUser.uuid}/profile`), jwtToken);
      const response = await authRequest.send(userInfo);

      const body = response.body;

      expect(updateSpy).toHaveBeenCalledWith({ uuid: regularUser.uuid }, userInfo);

      expect(body.status).toBe(HttpJsonStatus.Ok);
    });
  });
});
