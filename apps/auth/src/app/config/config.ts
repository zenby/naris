import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { ConfigService } from '@nestjs/config';
import { CommonAppConfig, Jwt } from '@soer/sr-common-interfaces';

export interface Configuration<T extends TypeOrmModuleOptions = unknown> extends CommonAppConfig {
  jwt: Jwt;
  typeOrm: T;
}

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: process.env.DATABASE_TYPE as MysqlConnectionOptions['type'],
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE ? process.env.DATABASE_SYNCHRONIZE === 'true' : true,
    autoLoadEntities: process.env.DATABASE_AUTO_LOAD_ENTITIES
      ? process.env.DATABASE_AUTO_LOAD_ENTITIES === 'true'
      : true,
    entities: [`${__dirname}/**/*.entity.{ts,js}`],
  };
}

export function configurationFactory(): Configuration {
  return {
    port: process.env.AUTH_BACK_PORT ? parseInt(process.env.AUTH_BACK_PORT, 10) : 3100,
    jwt: {
      jwtSecret: process.env.JWT_SECRET || 'Some random key here',
      expiresInAccess: setExpiresIn(process.env.EXP_ACCESS || 60 * 15), // 15 min
      expiresInRefresh: setExpiresIn(process.env.EXP_REFRESH || 60 * 60 * 24 * 30), // 30 days
      cookieName: process.env.COOKIE_NAME || 'refresh_token',
    },
    typeOrm: getTypeOrmConfig(),
  };
}

export async function typeOrmFactory(configService: ConfigService): Promise<TypeOrmModuleOptions> {
  return await configService.get<TypeOrmModuleOptions>('typeOrm');
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
