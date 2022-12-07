export interface Configuration {
  port: number;
  jwt: {
    jwtSecret: string;
    expiresInAccess: number | string;
    expiresInRefresh: number | string;
    cookieName: string;
  };
}

export function configurationFactory(): Configuration {
  return {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3100,
    jwt: {
      jwtSecret: process.env.JWT_SECRET || 'Some random key here',
      expiresInAccess: setExpiresIn(process.env.EXP_ACCESS || 60 * 15), // 15 min
      expiresInRefresh: setExpiresIn(process.env.EXP_REFRESH || 60 * 60 * 24), // 1 day
      cookieName: process.env.COOKIE_NAME || 'refresh_token',
    },
  };
}

function setExpiresIn(exp: string | number): string | number {
  if (typeof exp === 'number') {
    return exp;
  }

  const stringToNumber = parseInt(exp, 10);

  // case when expiresIn is string like '1d' or '15m'
  if (Number.isNaN(stringToNumber)) {
    return exp;
  }

  // case when expiresIn is number like 60 * 15
  return stringToNumber;
}
