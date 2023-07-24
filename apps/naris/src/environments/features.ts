import { FeatureFlag, Features } from '@soer/sr-feature-flags';

// Для кастомизации флагов в рантайме
// в localStorage предусмотрена возможность задать любые фичефлаги
let flags: Partial<Features> = {};
try {
  const flagsJSON = localStorage.getItem('featureFlags') || '{}';
  flags = JSON.parse(flagsJSON);
  console.log('Load flags from storage', flags);
} catch (e) {
  flags = {};
  console.error(e);
}

export const prodFeatures: Features = {
  [FeatureFlag.api_v1]: false,
  [FeatureFlag.api_v2]: true,
  [FeatureFlag.auth_v1]: false,
  [FeatureFlag.auth_v2]: true,
  [FeatureFlag.document_properties]: false,
  [FeatureFlag.personal_activity_journal]: true,
  [FeatureFlag.subscription]: false,
  ...flags,
};

export const abFeatures: Features = {
  ...prodFeatures,
  [FeatureFlag.auth_v2]: true,
  ...flags,
};

export const devFeatures: Features = {
  ...prodFeatures,
  [FeatureFlag.api_v2]: true,
  [FeatureFlag.document_properties]: true,
  [FeatureFlag.personal_activity_journal]: true,
  [FeatureFlag.subscription]: true,
  ...flags,
};

export const devAbFeatures: Features = {
  ...abFeatures,
  ...flags,
};

export const personalFeatures: Features = {
  ...devFeatures,
  [FeatureFlag.api_v1]: false,
  [FeatureFlag.api_v2]: true,
  [FeatureFlag.auth_v1]: false,
  [FeatureFlag.auth_v2]: true,
  ...flags,
};
