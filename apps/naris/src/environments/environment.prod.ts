import { EnvironmentInterface } from './environment.interface';
import { prodFeatures } from './features';
import { getProdHostVariables } from './getHostVariables';

export const environment: EnvironmentInterface = {
  ...getProdHostVariables(),
  production: true,
  features: prodFeatures,
};
