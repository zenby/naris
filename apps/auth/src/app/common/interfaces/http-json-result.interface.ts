export interface HttpJsonResult<T> {
  status: 'ok' | 'error';
  items: T[];
}
