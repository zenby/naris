import { Configuration } from '../../config/config';

export const testConfig: Configuration['jwt'] = {
  cookieName: 'refreshToken',
  expiresInAccess: 10,
  expiresInRefresh: 10,
  jwtSecret: 'secret',
  redirectUrl: '/success',
};
