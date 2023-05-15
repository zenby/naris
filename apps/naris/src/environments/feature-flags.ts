import { DynamicConfig } from './environment.interface';

export const prod: DynamicConfig = {};

export const ab: DynamicConfig = {
  ...prod,
  auth_v2: true,
};

export const dev: DynamicConfig = {
  ...prod,
};

export const dev_ab: DynamicConfig = {
  ...ab,
};

export const personal: DynamicConfig = {
  ...dev,
};
