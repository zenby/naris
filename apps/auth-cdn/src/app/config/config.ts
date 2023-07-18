import { join } from 'path';
import { CommonAppConfig, Jwt } from '@soer/sr-common-interfaces';

export interface Configuration extends CommonAppConfig {
  fileStoragePath: string;
  serveUploadsRoute: string;
  host: string;
  jwt: Jwt;
}

export function configurationFactory(): Configuration {
  return {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3400,
    serveUploadsRoute: process.env.SERVE_UPLOADS_ROUTE ?? 'uploads',
    host: process.env.AUTH_CDN_HOST ?? '',
    fileStoragePath: process.env.FILE_STORAGE_PATH ?? join(__dirname, '../../../', `apps/auth-cdn/src/assets`),
    jwt: {
      jwtSecret: process.env.JWT_SECRET || 'Some random key here',
    },
  };
}
