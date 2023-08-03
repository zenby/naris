import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import cookieParser = require('cookie-parser');
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { HttpJsonStatus } from '@soer/sr-common-interfaces';
import { faker } from '@faker-js/faker';
import { UserInfoDto } from './dto/user-info-dto';
import { UserController } from './user.controller';
import { regularUser, testUsers } from './tests/test.users';
import { userTestConfig } from './tests/user.test.config';
import * as supertest from 'supertest';
import { UserTestModule } from './tests/user.test.module';
import { AuthRequestMakeType } from '../auth/tests/auth.test.helper';

describe('user controller e2e tests', () => {
  let app: INestApplication;
  let request: ReturnType<typeof supertest>;
  let userRepo: Repository<UserEntity>;
  let makeAdminAuthRequest: AuthRequestMakeType;
  let makeRegularAuthRequest: AuthRequestMakeType;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserTestModule.forConfig(userTestConfig)],
      controllers: [UserController],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();

    makeAdminAuthRequest = moduleRef.get<AuthRequestMakeType>('makeAdminAuthRequest');
    makeRegularAuthRequest = moduleRef.get<AuthRequestMakeType>('makeRegularAuthRequest');
    userRepo = app.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    request = supertest(app.getHttpServer());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /users', () => {
    const isUsersEntity = () => expect.arrayContaining([expect.objectContaining({ email: expect.any(String) })]);

    it('should return a list of users when user is an admin', async () => {
      const authRequest = makeAdminAuthRequest(request.get('/users'));

      const response = await authRequest.send().expect(200);
      const { body } = response;

      expect(body.items).toHaveLength(testUsers.length);
      expect(body.items).toEqual(isUsersEntity());
    });

    it('should return 403 error when user not an admin', async () => {
      const authRequest = makeRegularAuthRequest(request.get('/users'));

      await authRequest.send().expect(403);
    });

    it('should return 401 error when not authorized', async () => {
      await request.get('/users').send().expect(401);
    });
  });

  describe('DELETE /user/id', () => {
    it('should return ok status when user deleted by an admin', async () => {
      const userToDelete = regularUser;
      const userRepositoryDeleteSpy = jest.spyOn(userRepo, 'delete');
      const authRequest = makeAdminAuthRequest(request.delete(`/user/${regularUser.id}`));

      const response = await authRequest.send().expect(200);
      const { body } = response;

      expect(userRepositoryDeleteSpy).toHaveBeenCalledWith({ id: `${userToDelete.id}` });
      expect(body.status).toBe(HttpJsonStatus.Ok);
    });

    it('should return 403 error when user not an admin', async () => {
      const userToDelete = testUsers[1];

      const authRequest = makeRegularAuthRequest(request.delete(`/user/${userToDelete.id}`));

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
      const updateSpy = jest.spyOn(userRepo, 'update');
      const authRequest = makeAdminAuthRequest(request.put(`/user/${userId}`));

      await authRequest.send({ isBlocked: true }).expect(200);

      expect(updateSpy).toHaveBeenCalledWith({ id: userId }, { isBlocked: true });
    });

    it('should unblock user when user unblocked by an admin', async () => {
      const userId = faker.random.numeric();
      const updateSpy = jest.spyOn(userRepo, 'update');
      const authRequest = makeAdminAuthRequest(request.put(`/user/${userId}`));

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
      const authRequest = makeAdminAuthRequest(request.put(`/user/${wrongId}/profile`));

      const response = await authRequest.send(userInfo);
      const { body } = response;

      expect(body.status).toBe(HttpJsonStatus.Ok);
    });

    it('should edit the profile if the user is an owner of the profile (matches by uuid)', async () => {
      const userInfo: UserInfoDto = { firstName: 'firstname', lastName: 'lastname' };
      const updateSpy = jest.spyOn(userRepo, 'update');
      const authRequest = makeRegularAuthRequest(request.put(`/user/${regularUser.uuid}/profile`));

      const response = await authRequest.send(userInfo);
      const { body } = response;

      expect(updateSpy).toHaveBeenCalledWith({ uuid: regularUser.uuid }, userInfo);
      expect(body.status).toBe(HttpJsonStatus.Ok);
    });
  });
});
