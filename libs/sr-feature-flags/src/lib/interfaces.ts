export enum FeatureFlag {
  api_v1 = 'api_v1',
  api_v2 = 'api_v2',
  auth_v1 = 'auth_v1',
  auth_v2 = 'auth_v2',
  document_properties = 'document_properties',
  personal_activity_journal = 'personal_activity_journal',
  subscription = 'subscription',
}

export type Features = Record<FeatureFlag, boolean>;
