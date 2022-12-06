import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app/app.module';
import { setupSwagger } from './swagger';

const PORT = process.env.AUTH_PORT || '3100';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ATTENTION! This call must come before all app.use(...)
  app.use(helmet());

  setupSwagger(app, PORT);

  await app.listen(PORT);
  Logger.log(`🚀 Application is running on: http://localhost:${PORT}`);
}

bootstrap();
