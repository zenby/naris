import { prodFeatures } from 'apps/naris/src/environments/features';
import { EnvironmentInterface } from '../../src/environments/environment.interface';
import { getDevHostVariables } from '../../src/environments/getHostVariables';

const HOST = '';

export const environment: EnvironmentInterface = {
  ...getDevHostVariables(),
  production: false,
  host: HOST,
  googleAuthUrl: HOST + '/api/auth/google',
  patreonAuthUrl: HOST + '/api/auth/patreon',
  yandexAuthUrl: HOST + '/api/auth/yandex',
  apiUrl: HOST + '/api/',
  assetsUrl: HOST + '/assets/',
  privateAssetsUrl: HOST + '/assets/private/',
  payServiceUrl: HOST + '/api/v2/seller',
  features: {
    ...prodFeatures,
  },
};
