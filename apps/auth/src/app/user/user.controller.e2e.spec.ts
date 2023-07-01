import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import cookieParser = require('cookie-parser');
import * as supertest from 'supertest';
import { DeleteResult, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Configuration } from '../config/config';
import { UserEntity } from './user.entity';
import { UserModule } from './user.module';
import { HttpJsonResult, UserRole } from '@soer/sr-common-interfaces';
import { faker } from '@faker-js/faker';
import { getJWTTokenForUserWithRole } from '../auth/tests/get-jwt.test.helper';
import { testFingerprint } from './tests/test.users';

describe('user controller e2e tests', () => {
  let app: INestApplication;
  let request: ReturnType<typeof supertest>;
  let userRepo: Repository<UserEntity>;

  const config: Configuration['jwt'] = {
    cookieName: 'refreshToken',
    expiresInAccess: 10000,
    expiresInRefresh: 10000,
    jwtSecret: 'secret',
  };

  beforeAll(async () => {
    const configMock = {
      get: jest.fn().mockImplementation((): Configuration['jwt'] => config),
    };

    const repositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
      providers: [JwtService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(getRepositoryToken(UserEntity))
      .useValue(repositoryMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();

    userRepo = app.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    request = supertest(app.getHttpServer());
  });

  describe('GET /users', () => {
    let users: UserEntity[];
    let adminUser: UserEntity;

    beforeAll(async () => {
      adminUser = getTestUser({ role: UserRole.ADMIN });
      users = [getTestUser(), getTestUser(), adminUser];
    });

    function isUserEntity(arg: object): arg is UserEntity[] {
      return arg && Array.isArray(arg) && arg[0].email && typeof arg[0].email == 'string';
    }

    it('should return a list of users when user is an admin', async () => {
      const jwtToken = getJWTTokenForUserWithRole(adminUser, testFingerprint);

      jest.spyOn(userRepo, 'find').mockResolvedValueOnce(users);
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(adminUser);

      const response = await request
        .get('/users')
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .set('x-original-forwarded-for', testFingerprint.ipAddresses.join(','))
        .set('user-agent', testFingerprint.userAgent)
        .send()
        .expect(200);

      const body: HttpJsonResult<UserEntity> = response.body;

      expect(body.items.length == users.length);
      expect(isUserEntity(body.items)).toBeTruthy;
    });

    it('should return 403 error when user not an admin', async () => {
      const user = getTestUser();

      const jwtToken = getJWTTokenForUserWithRole(adminUser, testFingerprint);

      jest.spyOn(userRepo, 'find').mockResolvedValueOnce(users);
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);

      await request
        .get('/users')
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .set('x-original-forwarded-for', testFingerprint.ipAddresses.join(','))
        .set('user-agent', testFingerprint.userAgent)
        .send()
        .expect(403);
    });

    it('should return 401 error when not authorized', async () => {
      await request
        .get('/users')
        .set('x-original-forwarded-for', testFingerprint.ipAddresses.join(','))
        .set('user-agent', testFingerprint.userAgent)
        .send()
        .expect(401);
    });
  });

  describe('DELETE /user/id', () => {
    it('should return ok status when user deleted by an admin', async () => {
      const adminUser = getTestUser({ role: UserRole.ADMIN });
      const userToDelete = getTestUser();

      const jwtToken = getJWTTokenForUserWithRole(adminUser, testFingerprint);

      const userRepositoryDeleteSpy = jest.spyOn(userRepo, 'delete').mockResolvedValueOnce({} as DeleteResult);
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(adminUser);

      const response = await request
        .delete(`/user/${userToDelete.id}`)
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .set('x-original-forwarded-for', testFingerprint.ipAddresses.join(','))
        .set('user-agent', testFingerprint.userAgent)
        .send()
        .expect(200);

      const body: HttpJsonResult<DeleteResult> = response.body;

      expect(userRepositoryDeleteSpy).toHaveBeenCalledWith({ id: `${userToDelete.id}` });
      expect(body.status == 'ok').toBeTruthy;
    });

    it('should return 403 error when user not an admin', async () => {
      const user = getTestUser();
      const userToDelete = getTestUser();

      const jwtToken = getJWTTokenForUserWithRole(user, testFingerprint);

      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);

      await request
        .delete(`/user/${userToDelete.id}`)
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .set('x-original-forwarded-for', testFingerprint.ipAddresses.join(','))
        .set('user-agent', testFingerprint.userAgent)
        .send()
        .expect(403);
    });

    it('should return 401 error when not authorized', async () => {
      const userToDelete = getTestUser();

      await request.delete(`/user/${userToDelete.id}`).send().expect(401);
    });
  });

  describe('PUT /user/id', () => {
    it('should block user when user blocked by an admin', async () => {
      const adminUser = getTestUser({ role: UserRole.ADMIN });
      const userId = faker.random.numeric();

      const jwtToken = getJWTTokenForUserWithRole(adminUser, testFingerprint);

      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(adminUser);

      await request
        .put(`/user/${userId}`)
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .set('x-original-forwarded-for', testFingerprint.ipAddresses.join(','))
        .set('user-agent', testFingerprint.userAgent)
        .send({ isBlocked: true })
        .expect(200);

      expect(userRepo.update).toHaveBeenCalledWith({ id: userId }, { isBlocked: true });
    });

    it('should block user when user unblocked by an admin', async () => {
      const adminUser = getTestUser({ role: UserRole.ADMIN });
      const userId = faker.random.numeric();

      const jwtToken = getJWTTokenForUserWithRole(adminUser, testFingerprint);

      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(adminUser);

      await request
        .put(`/user/${userId}`)
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .set('x-original-forwarded-for', testFingerprint.ipAddresses.join(','))
        .set('user-agent', testFingerprint.userAgent)
        .send({ isBlocked: false })
        .expect(200);

      expect(userRepo.update).toHaveBeenCalledWith({ id: userId }, { isBlocked: false });
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
