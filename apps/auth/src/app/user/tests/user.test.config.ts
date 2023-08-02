import { Configuration } from '../../config/config';

export const userTestConfig: Configuration['jwt'] = {
  cookieName: 'refreshToken',
  expiresInAccess: 10000,
  expiresInRefresh: 10000,
  jwtSecret: 'secret',
};
