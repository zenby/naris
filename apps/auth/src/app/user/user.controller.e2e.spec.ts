import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import cookieParser = require('cookie-parser');
import * as supertest from 'supertest';
import { DeleteResult, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Configuration } from '../config/config';
import { UserEntity, UserRole } from './user.entity';
import { UserModule } from './user.module';
import { HttpJsonResult } from '@soer/sr-common-interfaces';

describe('user controller e2e tests', () => {
  let app: INestApplication;
  let request: ReturnType<typeof supertest>;
  let userRepo: Repository<UserEntity>;
  let jwtService: JwtService;

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
    jwtService = app.get<JwtService>(JwtService);
    request = supertest(app.getHttpServer());
  });

  describe('GET /users', () => {
    let users: UserEntity[];
    let adminUser: UserEntity;

    beforeAll(async () => {
      adminUser = new UserEntity();
      Object.assign(adminUser, {
        id: 1,
        login: 'test',
        email: 'test@test.example',
        role: UserRole.ADMIN,
      });

      const user1 = new UserEntity();
      Object.assign(user1, {
        id: 2,
        login: 'user1',
        email: 'user2@test.example',
        role: UserRole.USER,
      });

      const user2 = new UserEntity();
      Object.assign(user2, {
        id: 3,
        login: 'user2',
        email: 'user2@test.example',
        role: UserRole.USER,
      });

      users = [user1, user2, adminUser];
    });

    function isUserEntity(arg: object): arg is UserEntity[] {
      return arg && arg[0].email && typeof arg[0].email == 'string';
    }

    it('should return a list of users when user is an admin', async () => {
      const { jwtSecret: secret, expiresInRefresh: expiresIn } = config;

      const jwtToken = await jwtService.signAsync(
        { userId: adminUser.id, userEmail: adminUser.email, userRole: adminUser.role },
        { secret, expiresIn }
      );

      jest.spyOn(userRepo, 'find').mockResolvedValueOnce(users);
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(adminUser);

      const response = await request
        .get('/users')
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .send()
        .expect(200);
      const body: HttpJsonResult<UserEntity> = response.body;

      expect(body.items.length == 3);
      expect(isUserEntity(body.items)).toBeTruthy;
    });

    it('should return 403 error when user not an admin', async () => {
      const user = new UserEntity();
      Object.assign(user, {
        id: 2,
        login: 'user1',
        email: 'user2@test.example',
        role: UserRole.USER,
      });

      const { jwtSecret: secret, expiresInRefresh: expiresIn } = config;

      const jwtToken = await jwtService.signAsync(
        { userId: user.id, userEmail: user.email, userRole: user.role },
        { secret, expiresIn }
      );

      jest.spyOn(userRepo, 'find').mockResolvedValueOnce(users);
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);

      await request
        .get('/users')
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .send()
        .expect(403);
    });

    it('should return 403 error when not authorized', async () => {
      await request.get('/users').send().expect(403);
    });
  });

  describe('DELETE /user/id', () => {
    it('should return ok status when user deleted by an admin', async () => {
      const adminUser = new UserEntity();
      Object.assign(adminUser, {
        id: 1,
        login: 'test',
        email: 'test@test.example',
        role: UserRole.ADMIN,
      });

      const userToDelete = new UserEntity();
      Object.assign(userToDelete, {
        id: 2,
        login: 'user1',
        email: 'user2@test.example',
        role: UserRole.USER,
      });

      const { jwtSecret: secret, expiresInRefresh: expiresIn } = config;

      const jwtToken = await jwtService.signAsync(
        { userId: adminUser.id, userEmail: adminUser.email, userRole: adminUser.role },
        { secret, expiresIn }
      );

      const userRepositoryDeleteSpy = jest.spyOn(userRepo, 'delete').mockResolvedValueOnce({} as DeleteResult);
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(adminUser).mockResolvedValueOnce(userToDelete);

      const response = await request
        .delete(`/user/${userToDelete.id}`)
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .send()
        .expect(200);
      const body: HttpJsonResult<DeleteResult> = response.body;

      expect(userRepositoryDeleteSpy).toHaveBeenCalledWith({ id: `${userToDelete.id}` });
      expect(body.status == 'ok').toBeTruthy;
    });

    it('should return 403 error when user not an admin', async () => {
      const user = new UserEntity();
      Object.assign(user, {
        id: 2,
        login: 'user1',
        email: 'user2@test.example',
        role: UserRole.USER,
      });

      const userToDelete = new UserEntity();
      Object.assign(userToDelete, {
        id: 2,
        login: 'user1',
        email: 'user2@test.example',
        role: UserRole.USER,
      });

      const { jwtSecret: secret, expiresInRefresh: expiresIn } = config;

      const jwtToken = await jwtService.signAsync(
        { userId: user.id, userEmail: user.email, userRole: user.role },
        { secret, expiresIn }
      );

      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);

      await request
        .delete(`/user/${userToDelete.id}`)
        .set('Cookie', [`${config.cookieName}=${jwtToken}`])
        .send()
        .expect(403);
    });

    it('should return 403 error when not authorized', async () => {
      const userToDelete = new UserEntity();
      Object.assign(userToDelete, {
        id: 2,
        login: 'user1',
        email: 'user2@test.example',
        role: UserRole.USER,
      });

      await request.delete(`/user/${userToDelete.id}`).send().expect(403);
    });
  });
});
