import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { setupSwagger } from './swagger';

const PORT = process.env.AUTH_PORT || '3300';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app, PORT);

  await app.listen(PORT);
  Logger.log(`🚀 Application is running on: http://localhost:${PORT}`);
}

bootstrap();
