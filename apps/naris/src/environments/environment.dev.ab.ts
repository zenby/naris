import { EnvironmentInterface } from './environment.interface';
import { devAbFeatures } from './features';
import { getDevHostVariables } from './getHostVariables';

export const environment: EnvironmentInterface = {
  ...getDevHostVariables(),
  production: false,
  features: devAbFeatures,
};
