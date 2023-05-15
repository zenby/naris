export interface DynamicConfig {
  auth_v2?: boolean;
}

export interface HostVariables {
  host: string;
  googleAuthUrl: string;
  patreonAuthUrl: string;
  yandexAuthUrl: string;
  apiUrl: string;
  assetsUrl: string;
  privateAssetsUrl: string;
  payServiceUrl: string;
}

export interface EnvironmentInterface extends HostVariables {
  production: boolean;
  features: DynamicConfig;
}
