export interface DynamicConfig {
  auth_v1?: boolean;
  auth_v2?: boolean;
}

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
