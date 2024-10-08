import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

import { AppModule } from './app/app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get('port');
  const NODE_ENV = configService.get('NODE_ENV');

  if (NODE_ENV === 'development') {
    app.enableCors({
      origin: true,
      credentials: true,
    });

    app.use(
      helmet.default({
        crossOriginOpenerPolicy: false, // для получения jwt токена
        contentSecurityPolicy: false,
      })
    );

    setupSwagger(app, port);
  }

  app.use(cookieParser());

  await app.listen(port);
  Logger.log(`Application is running in "${NODE_ENV}" mode`);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
