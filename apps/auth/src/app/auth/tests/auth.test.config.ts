import { Configuration } from '../../config/config';

export const authTestConfig: Configuration['jwt'] = {
  cookieName: 'refreshToken',
  expiresInAccess: 10,
  expiresInRefresh: 10,
  jwtSecret: 'secret',
  redirectUrl: '/success',
};
