import { EnvironmentInterface } from './environment.interface';
import { ab } from './feature-flags';
import { getProdHostVariables } from './getHostVariables';

export const environment: EnvironmentInterface = {
  ...getProdHostVariables(),
  production: true,
  features: ab,
};
