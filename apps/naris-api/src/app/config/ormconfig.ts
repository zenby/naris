import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

import { getTypeOrmConfig } from './config';

// Config for migrations
export const dataSourceOptions = {
  ...getTypeOrmConfig(),
  entities: [`${join(__dirname, '../')}**/*.entity.{ts,js}`],
  migrations: [`${join(__dirname, '../../../../../')}apps/naris-api/migrations/**/*{.ts,.js}`],
  cli: {
    migrationsDir: `apps/naris-api/migrations`,
  },
} as unknown as DataSourceOptions;

export const dataSource: DataSource = new DataSource(dataSourceOptions);
