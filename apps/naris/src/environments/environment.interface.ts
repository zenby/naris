export enum featuresEnum {
  auth_v1 = 'auth_v1',
  auth_v2 = 'auth_v2',
}

export type DynamicConfig = {
  [key in featuresEnum]?: boolean;
};

export type DynamicConfigKeys = keyof DynamicConfig;

export interface HostVariables {
  host: string;
  googleAuthUrl: string;
  patreonAuthUrl: string;
  yandexAuthUrl: string;
  apiUrl: string;
  urlV2: string;
  assetsUrl: string;
  privateAssetsUrl: string;
  payServiceUrl: string;
}

export interface EnvironmentInterface extends HostVariables {
  production: boolean;
  features: DynamicConfig;
}
