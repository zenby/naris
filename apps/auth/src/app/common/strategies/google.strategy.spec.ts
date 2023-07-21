import { AuthService } from '../../auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { GoogleStrategy } from './google.strategy';
import { UserService } from '../../user/user.service';
import { Profile } from 'passport';
import { ConfigService } from '@nestjs/config';
import { max } from 'class-validator';
import { UserTestModule } from '../../user/tests/user.test.module';

describe('RefreshCookieStrategy', () => {
  let strategy: GoogleStrategy;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserTestModule],
      providers: [
        GoogleStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'jwt') {
                return { cookieName: 'test_cookie' };
              }
              return undefined;
            }),
          },
        },
        AuthService,
      ],
    }).compile();

    strategy = module.get<GoogleStrategy>(GoogleStrategy);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should create user if user does not found', async () => {
    const email = { value: 'test@gmail.com' };
    const createUser = jest.spyOn(userService, 'createUser');

    await strategy.validate('', '', { emails: [email] } as Profile);

    expect(createUser).toHaveBeenCalled();
  });
});
