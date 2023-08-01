import { AuthService } from '../../auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { YandexStrategy } from './yandex.strategy';
import { UserService } from '../../user/user.service';
import { Profile } from 'passport';
import { ConfigService } from '@nestjs/config';
import { UserTestModule } from '../../user/tests/user.test.module';

describe('YandexStrategy', () => {
  let strategy: YandexStrategy;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserTestModule],
      providers: [
        YandexStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'jwt') {
                return { cookieName: 'test_cookie' };
              }
              if (key === 'yandexClient') {
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

    strategy = module.get<YandexStrategy>(YandexStrategy);
    userService = module.get<UserService>(UserService);
  });

  it('should create user if user does not found', async () => {
    const email = { value: 'test@gmail.com' };
    const createUser = jest.spyOn(userService, 'createUser');

    await strategy.validate('', '', { emails: [email] } as Profile);

    expect(createUser).toHaveBeenCalled();
  });
});
