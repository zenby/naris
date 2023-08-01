import { EnvironmentInterface } from './environment.interface';
import { personalFeatures } from './features';
import { getDevHostVariables } from './getHostVariables';

export const environment: EnvironmentInterface = {
  ...getDevHostVariables(),
  production: false,
  features: personalFeatures,
};
