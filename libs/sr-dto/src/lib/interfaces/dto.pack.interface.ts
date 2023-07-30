import { DtoErrorMessage } from './serialize-json.model';

export const OK = 'ok';
export const ERROR = 'error';
export const LOADING = 'loading';
export const UPDATE = 'update';
export const INIT = 'init';

export type DtoStatus = typeof INIT | typeof OK | typeof ERROR | typeof LOADING | typeof UPDATE;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DtoPackWithResult<T = any> {
  status: typeof OK;
  items: T[];
}

export interface DtoPackWithErrors {
  status: typeof ERROR;
  items: DtoErrorMessage[];
}

export type DtoPackWithStatus<T> = DtoPackWithResult<T> | DtoPackWithErrors;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DtoPack<T = any> {
  status: DtoStatus;
  items: T[];
}
