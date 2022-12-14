import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

const user = {
  id: 1,
  email: 'bar@foo.com',
  login: 'bar',
  password: 'super-password',
};

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(user),
            save: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
