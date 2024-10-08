import { AuthService } from '../../auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { GoogleStrategy } from './google.strategy';
import { UserService } from '../../user/user.service';
import { Profile } from 'passport';
import { ConfigService } from '@nestjs/config';
import { UserTestModule } from '../../user/tests/user.test.module';
import { userTestConfig } from '../../user/tests/user.test.config';

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserTestModule.forConfig(userTestConfig)],
      providers: [
        GoogleStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'jwt') {
                return { cookieName: 'test_cookie' };
              }
              if (key === 'googleClient') {
                return {
                  clientID: 'id',
                  clientSecret: 'secret',
                  callbackURL: 'callbackURL',
                };
              }
              return undefined;
            }),
          },
        },
        AuthService,
      ],
    }).compile();

    strategy = module.get<GoogleStrategy>(GoogleStrategy);
    userService = module.get<UserService>(UserService);
  });

  it('should create user if user does not found', async () => {
    const email = { value: 'test@gmail.com' };
    const createUser = jest.spyOn(userService, 'createUser');

    await strategy.validate('', '', { emails: [email] } as Profile);

    expect(createUser).toHaveBeenCalled();
  });
});
