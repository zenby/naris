export enum HttpJsonStatus {
  Ok = 'ok',
  Error = 'error',
}

export interface HttpJsonResult<T> {
  status: HttpJsonStatus;
  items: T[];
}
