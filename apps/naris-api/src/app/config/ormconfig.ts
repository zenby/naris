import { join } from 'path';

import { getTypeOrmConfig } from './config';

// Config for migrations
export = {
  ...getTypeOrmConfig(),
  entities: [`${join(__dirname, '../')}**/*.entity.{ts,js}`],
  migrations: [`${join(__dirname, '../../../../../')}apps/naris-api/migrations/**/*{.ts,.js}`],
  cli: {
    migrationsDir: `apps/naris-api/migrations`,
  },
};
