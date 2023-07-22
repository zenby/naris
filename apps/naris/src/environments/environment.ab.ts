import { EnvironmentInterface } from './environment.interface';
import { abFeatures } from './features';
import { getProdHostVariables } from './getHostVariables';

export const environment: EnvironmentInterface = {
  ...getProdHostVariables(),
  production: true,
  features: abFeatures,
};
