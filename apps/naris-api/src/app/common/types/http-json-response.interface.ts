export enum HttpJsonStatus {
  Ok = 'ok',
  Error = 'error',
}

export interface HttpJsonResponse<T> {
  status: HttpJsonStatus;
  items: T[];
}
