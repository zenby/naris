import { UserRole } from '@soer/sr-common-interfaces';
import { UserEntity } from '../user.entity';
import { faker } from '@faker-js/faker';

export const regularUser = getTestUser({
  id: 1,
  login: 'regularUser',
  email: 'regularUser@mail.example',
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
  user.hashPassword();
  return user;
}
