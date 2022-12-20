import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/sign-in-user.dto';

const createUserDto: CreateUserDto = {
  login: 'test login',
  password: 'test password',
  email: 'test@email.com',
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: {
            getAccessToken: jest.fn().mockImplementation((user) => Promise.resolve('test-access-token')),
            getRefreshToken: jest.fn().mockImplementation((user) => Promise.resolve('test-refresh-token')),
            createUser: jest.fn().mockImplementation((createUserDto: CreateUserDto) => ({ id: 1, ...createUserDto })),
            getComparedUser: jest
              .fn()
              .mockImplementation((signInUserDto: LoginUserDto) => ({ id: 1, ...signInUserDto })),
          },
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
});
