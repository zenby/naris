import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import { AppModule } from './app/app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ATTENTION! This call must come before all app.use(...)
  app.use(helmet());

  const port = configService.get('port');

  setupSwagger(app, port);

  if (!configService.get<string>('verifyUrl')) {
    Logger.warn('URL to validate token is not specified in .env!');
  }

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
