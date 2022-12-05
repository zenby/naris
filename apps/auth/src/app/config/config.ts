export interface Configuration {
  port: number;
  jwtSecret: string;
  expAccess: number;
  expRefresh: number;
}

export function configurationFactory(): Configuration {
  return {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    jwtSecret: process.env.JWT_SECRET || 'Some random key here',
    expAccess: process.env.EXP_ACCESS ? parseInt(process.env.EXP_ACCESS, 10) : 60 * 15, // 15 min
    expRefresh: process.env.EXP_REFRESH ? parseInt(process.env.EXP_REFRESH, 10) : 60 * 60 * 24, // 1 day
  };
}
