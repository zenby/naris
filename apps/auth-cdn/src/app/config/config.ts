import { join } from 'path';

export interface Configuration {
  port: number;
  fileStoragePath: string;
}

export function configurationFactory(): Configuration {
  return {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3400,
    fileStoragePath: process.env.FILE_STORAGE_PATH ?? join(__dirname, '../../../', `apps/auth-cdn/src/assets`),
  };
}
