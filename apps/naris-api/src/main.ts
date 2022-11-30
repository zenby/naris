import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { setupSwagger } from './swagger';

const API_PREFIX = 'api';
const PORT = process.env.AUTH_PORT || '3200';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(API_PREFIX);

  setupSwagger(app, PORT);

  await app.listen(PORT);
  Logger.log(`🚀 Application is running on: http://localhost:${PORT}/${API_PREFIX}`);
}

bootstrap();
