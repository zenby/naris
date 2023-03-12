export interface CommonConfig {
  port: number;
}

export interface Jwt {
  jwtSecret: string;
  expiresInAccess?: number | string;
  expiresInRefresh?: number | string;
  cookieName?: string;
}
