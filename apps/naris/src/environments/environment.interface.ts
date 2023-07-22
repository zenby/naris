import { Features } from '@soer/sr-feature-flags';

export interface HostVariables {
  host: string;
  googleAuthUrl: string;
  patreonAuthUrl: string;
  yandexAuthUrl: string;
  apiUrl: string;
  narisApiUrl: string;
  urlV2: string;
  assetsUrl: string;
  privateAssetsUrl: string;
  payServiceUrl: string;
}

export interface EnvironmentInterface extends HostVariables {
  production: boolean;
  features: Features;
}
