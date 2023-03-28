import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserModule } from './user.module';
import { CreateUserDto } from './dto/create-user.dto';
import { Configuration } from '../config/config';
import { ConfigService } from '@nestjs/config';

describe('User service', () => {
  let userService: UserService;

  const userRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

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

    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(getRepositoryToken(UserEntity))
      .useValue(userRepositoryMock)
      .compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  describe('create user tests', () => {
    it('should create user with empty password', async () => {
      const returnUser = {
        id: 1,
        email: 'email@email.com',
        login: 'login',
        password: '',
        uuid: 'testuuid',
      };
      const existUser = new UserEntity();
      Object.assign(existUser, returnUser);
      const createUserDto: CreateUserDto = { login: 'login', email: 'email@email.com', password: '' };
      jest.spyOn(userRepositoryMock, 'save').mockResolvedValueOnce(existUser);

      const resultUser = await userService.createUser(createUserDto);

      expect(resultUser instanceof UserEntity).toBeTruthy();
      expect((resultUser as UserEntity).password).toEqual('');
    });

    it('should create user with hashed password if its not empty', async () => {
      const existUser = new UserEntity();
      const createUserDto: CreateUserDto = { login: 'login', email: 'email@email.com', password: '123' };
      Object.assign(existUser, createUserDto);
      await existUser.hashPassword();
      jest.spyOn(userRepositoryMock, 'save').mockResolvedValueOnce(existUser);

      const resultUser = await userService.createUser(createUserDto);

      expect(resultUser instanceof UserEntity).toBeTruthy();
      expect((resultUser as UserEntity).password === '').toBeFalsy();
    });
  });
});
