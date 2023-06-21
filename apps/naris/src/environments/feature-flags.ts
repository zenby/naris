import { DynamicConfig, featuresEnum } from './environment.interface';

export const prod: DynamicConfig = {
  [featuresEnum.auth_v2]: true,
};

export const ab: DynamicConfig = {
  ...prod,
  [featuresEnum.auth_v2]: true,
};

export const dev: DynamicConfig = {
  ...prod,
  [featuresEnum.personal_activity_journal]: true,
};

export const dev_ab: DynamicConfig = {
  ...ab,
};

export const personal: DynamicConfig = {
  ...dev,
  [featuresEnum.auth_v1]: false,
  [featuresEnum.auth_v2]: true,
  [featuresEnum.api_v1]: false,
  [featuresEnum.api_v2]: true,
};
