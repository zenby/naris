export interface CommonAppConfig {
  port: number;
}

export interface Jwt {
  jwtSecret: string;
  expiresInAccess?: number | string;
  expiresInRefresh?: number | string;
  cookieName?: string;
  redirectUrl?: string;
}
