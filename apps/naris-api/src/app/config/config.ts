import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface Config<T extends TypeOrmModuleOptions = any> {
  port: number;
  prefix: string;
  typeOrm: T;
}

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: (process.env.DATABASE_TYPE as any) ?? 'mariadb',
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 3306,
    username: process.env.DATABASE_USER ?? 'naris',
    password: process.env.DATABASE_PASSWORD ?? '123456',
    database: process.env.DATABASE_NAME ?? 'naris',
    synchronize: process.env.DATABASE_SYNCHRONIZE ? process.env.DATABASE_SYNCHRONIZE === 'true' : true,
    autoLoadEntities: process.env.DATABASE_AUTO_LOAD_ENTITIES
      ? process.env.DATABASE_AUTO_LOAD_ENTITIES === 'true'
      : true,
    entities: [`${__dirname}/**/*.entity.{ts,js}`],
  };
}

export function configurationFactory(): Config {
  return {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3200,
    prefix: process.env.PREFIX ?? 'api',
    typeOrm: getTypeOrmConfig(),
  };
}

export async function typeOrmFactory(configService: ConfigService): Promise<TypeOrmModuleOptions> {
  return await configService.get<any>('typeOrm');
}
