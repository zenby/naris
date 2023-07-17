import { DynamicConfig, featuresEnum } from './environment.interface';

// Для кастомизации флагов в рантайме
// в localStorge предусмотрена возможность задать любые
// фичефлаги
let flags = {};
try {
  const flagsJSON = localStorage.getItem('featureFlags') || '{}';
  flags = JSON.parse(flagsJSON);
  console.log('Load flags from storage', flags);
} catch (e) {
  flags = {};
  console.error(e);
}

export const prod: DynamicConfig = {
  [featuresEnum.api_v2]: true,
  [featuresEnum.auth_v2]: true,
  [featuresEnum.personal_activity_journal]: true,
  ...flags,
};

export const ab: DynamicConfig = {
  ...prod,
  [featuresEnum.auth_v2]: true,
  ...flags,
};

export const dev: DynamicConfig = {
  ...prod,
  [featuresEnum.personal_activity_journal]: true,
  [featuresEnum.subscription]: true,
  [featuresEnum.api_v2]: true,
  ...flags,
};

export const dev_ab: DynamicConfig = {
  ...ab,
  ...flags,
};

export const personal: DynamicConfig = {
  ...dev,
  [featuresEnum.auth_v1]: false,
  [featuresEnum.auth_v2]: true,
  [featuresEnum.api_v1]: false,
  [featuresEnum.api_v2]: true,
  ...flags,
};
