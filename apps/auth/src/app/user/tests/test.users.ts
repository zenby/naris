import { UserRole } from '@soer/sr-common-interfaces';
import { UserEntity } from '../user.entity';
import { faker } from '@faker-js/faker';
import { genSaltSync, hashSync } from 'bcrypt';
import { LoginUserDto } from '../dto/login-user.dto';
import { Fingerprint } from '../../auth/helpers/fingerprint';
import { Request } from 'express';
import { createRequest } from '../../auth/tests/get-jwt.test.helper';

export const testRequest: Request = createRequest(['127.0.0.1', '192.168.0.1'], 'Mozilla/5.0');
export const testFingerprint = new Fingerprint(testRequest);

export const regularUserCredentials: LoginUserDto = {
  login: 'regularUser',
  password: 'password',
};

export const regularUser = getTestUser({
  id: 1,
  login: regularUserCredentials.login,
  email: 'regularUser@mail.example',
  password: regularUserCredentials.password,
});

export const blockedUser = getTestUser({
  id: 2,
  login: 'blockedUser',
  email: 'blockedUser@mail.example',
  isBlocked: true,
});

export const adminUser = getTestUser({
  id: 3,
  login: 'AdminUser',
  email: 'adminUser@mail.example',
  role: UserRole.ADMIN,
});

export const testUsers = [regularUser, blockedUser, adminUser];

type UserInfo = {
  id?: number;
  login?: string;
  password?: string;
  email?: string;
  role?: UserRole;
  isBlocked?: boolean;
};

function hashPassword(user: UserEntity): void {
  if (user.password === '') return;
  const salt = genSaltSync();
  user.password = hashSync(user.password, salt);
}

function getTestUser(
  userInfo: UserInfo = { id: undefined, login: undefined, email: undefined, role: undefined, password: undefined }
) {
  const user = new UserEntity();
  Object.assign(user, {
    id: userInfo.id ?? faker.random.numeric(),
    login: userInfo.login ?? faker.internet.userName(),
    email: userInfo.email ?? faker.internet.email(),
    uuid: faker.datatype.uuid(),
    role: userInfo.role ?? UserRole.USER,
    blocked: userInfo.isBlocked ?? false,
    password: userInfo.password ?? '',
  });
  hashPassword(user);
  return user;
}
