import { EnvironmentInterface } from './environment.interface';
import { prod } from './feature-flags';
import { getProdHostVariables } from './getHostVariables';

export const environment: EnvironmentInterface = {
  ...getProdHostVariables(),
  production: true,
  features: prod,
};
