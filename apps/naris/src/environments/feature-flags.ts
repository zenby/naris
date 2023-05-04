import { DynamicConfig } from './environment.interface';

export const prod: DynamicConfig = {
  auth_v1: true,
};

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
  auth_v1: false,
  auth_v2: true,
};
