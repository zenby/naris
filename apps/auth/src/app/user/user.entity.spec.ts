import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('UserEntity', () => {
  const genSaltTestResult = 'mockedSalt';
  const hashTestResult = 'hashedPassword';
  const genSaltSpy = jest.spyOn(bcrypt, 'genSalt').mockImplementation((_?: number, __?: 'a' | 'b') => {
    return Promise.resolve(genSaltTestResult);
  });
  const hashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation((_: string | Buffer, __: string | number) => {
    return Promise.resolve(hashTestResult);
  });

  beforeEach(() => {
    genSaltSpy.mockClear();
    hashSpy.mockClear();
  });

  it('should hash password before insert', async () => {
    const testPassword = 'password123';
    const user = new UserEntity();
    user.password = testPassword;

    await user.hashPassword();

    expect(genSaltSpy).toHaveBeenCalled();
    expect(hashSpy).toHaveBeenCalledWith(testPassword, genSaltTestResult);
    expect(user.password).not.toBe(testPassword);
    expect(user.password).toEqual(hashTestResult);
  });

  it('should not hash empty password', async () => {
    const testPassword = '';
    const user = new UserEntity();
    user.password = testPassword;

    await user.hashPassword();

    expect(genSaltSpy).not.toHaveBeenCalled();
    expect(hashSpy).not.toHaveBeenCalled();
    expect(user.password).toBe(testPassword);
  });
});
