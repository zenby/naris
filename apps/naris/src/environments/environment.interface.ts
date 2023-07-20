export enum featuresEnum {
  auth_v1 = 'auth_v1',
  auth_v2 = 'auth_v2',
  api_v1 = 'api_v1',
  api_v2 = 'api_v2',
  document_properties = 'document_properties',
  personal_activity_journal = 'personal_activity_journal',
  subscription = 'subscription',
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
  narisApiUrl: string;
  urlV2: string;
  assetsUrl: string;
  privateAssetsUrl: string;
  payServiceUrl: string;
}

export interface EnvironmentInterface extends HostVariables {
  production: boolean;
  features: DynamicConfig;
}
