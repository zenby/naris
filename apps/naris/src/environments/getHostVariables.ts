import { HostVariables } from './environment.interface';

const DEV_HOST = 'https://stage.s0er.ru';
//const DEV_HOST = 'http://api.soer';
// const DEV_HOST = 'http://localhost:4000';

const PROD_HOST = 'https://platform.soer.pro';

function getHostVariables(host: string): HostVariables {
  return {
    host,
    googleAuthUrl: host + '/api/auth/google',
    patreonAuthUrl: host + '/api/auth/patreon',
    yandexAuthUrl: host + '/api/auth/yandex',
    apiUrl: host + '/api/',
    urlV2: host + '/v2/',
    assetsUrl: host + '/assets/',
    privateAssetsUrl: host + '/assets/private/',
    payServiceUrl: host + '/api/v2/seller',
  };
}

export function getDevHostVariables(): HostVariables {
  return getHostVariables(DEV_HOST);
}

export function getProdHostVariables(): HostVariables {
  return getHostVariables(PROD_HOST);
}
