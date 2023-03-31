import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

import { getTypeOrmConfig } from './config';

// Config for migrations
export const dataSourceOptions = {
  ...getTypeOrmConfig(),
  entities: [`${join(__dirname, '../')}**/*.entity.{ts,js}`],
  migrations: [join(__dirname, '../../../../../', 'apps/auth/migrations/**/*{.ts,.js}')],
  cli: {
    migrationsDir: `apps/auth/migrations`,
  },
} as unknown as DataSourceOptions;

export const dataSource: DataSource = new DataSource(dataSourceOptions);
