import { dev } from '../../src/environments/feature-flags';
import { EnvironmentInterface } from '../../src/environments/environment.interface';

const HOST = '';
export const environment: EnvironmentInterface = {
  production: false,
  host: HOST,
  googleAuthUrl: HOST + '/api/auth/google',
  patreonAuthUrl: HOST + '/api/auth/patreon',
  yandexAuthUrl: HOST + '/api/auth/yandex',
  apiUrl: HOST + '/api/',
  assetsUrl: HOST + '/assets/',
  privateAssetsUrl: HOST + '/assets/private/',
  payServiceUrl: HOST + '/api/v2/seller',
  features: dev,
};
