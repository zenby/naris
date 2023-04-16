import { UserRole } from '@soer/sr-common-interfaces';
import { UserEntity } from '../user.entity';
import { faker } from '@faker-js/faker';

export const TEST_USERS = [
  getTestUser({
    id: 1,
    login: 'Admin1',
    email: 'admin1@mail.example',
    role: UserRole.ADMIN,
  }),
  getTestUser({
    id: 2,
    login: 'regularUser',
    email: 'regularUser@mail.example',
  }),
  getTestUser({
    id: 3,
    login: 'blockedUser',
    email: 'blockedUser@mail.example',
    isBlocked: true,
  }),
];

type UserInfo = {
  id?: number;
  login?: string;
  email?: string;
  role?: UserRole;
  isBlocked?: boolean;
};

function getTestUser(userInfo: UserInfo = { id: undefined, login: undefined, email: undefined, role: undefined }) {
  const user = new UserEntity();
  Object.assign(user, {
    id: userInfo.id ?? faker.random.numeric(),
    login: userInfo.login ?? faker.internet.userName(),
    email: userInfo.email ?? faker.internet.email(),
    uuid: faker.datatype.uuid(),
    role: userInfo.role ?? UserRole.USER,
    blocked: userInfo.isBlocked ?? false,
  });
  return user;
}
