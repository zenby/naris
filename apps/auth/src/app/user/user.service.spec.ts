import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { UserTestModule } from './tests/user.test.module';
import { userTestConfig } from './tests/user.test.config';

describe('User service', () => {
  let userService: UserService;
  let testModule: TestingModule;
  let userRepository: Repository<UserEntity>;

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      imports: [UserTestModule.forConfig(userTestConfig)],
    }).compile();

    userService = testModule.get<UserService>(UserService);
    userRepository = testModule.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  afterAll(async () => {
    await testModule.close();
  });

  describe('createUser method', () => {
    it('should create user with empty password', async () => {
      const dto = { password: '', email: faker.internet.email(), login: faker.internet.userName() };
      const saveSpy = jest.spyOn(userRepository, 'save');

      const newUser = await userService.createUser(dto);

      expect(newUser).toBeInstanceOf(UserEntity);
      expect(newUser).toEqual(
        expect.objectContaining({
          password: '',
        })
      );
      expect(saveSpy).toHaveBeenCalledWith(expect.any(UserEntity));
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          password: '',
          email: dto.email,
          login: dto.login,
        })
      );
    });

    it("should create user with hashed password if it's not empty", async () => {
      const dto = { password: 'password123', email: faker.internet.email(), login: faker.internet.userName() };
      const saveSpy = jest.spyOn(userRepository, 'save');

      const newUser = await userService.createUser(dto);

      expect(newUser).toBeInstanceOf(UserEntity);
      expect(newUser).not.toEqual(expect.objectContaining({ password: dto.password }));
      expect(newUser).not.toEqual(expect.objectContaining({ password: '' }));
      expect(saveSpy).toHaveBeenCalledWith(expect.any(UserEntity));
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          password: expect.any(String),
          email: dto.email,
          login: dto.login,
        })
      );
    });
  });
});
