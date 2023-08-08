import { Module, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor, LoggerModule } from 'nestjs-pino';

import { AppModule } from './app/app.module';
import { setupSwagger } from './swagger';

const pinoDev = {
  pinoHttp: {
    customProps: () => ({
      context: 'HTTP',
    }),
    transport: {
      target: 'pino-pretty',
      options: {
        singleLine: true,
      },
    },
  },
};

const pinoProd = {
  pinoHttp: {
    level: 'info',
    customProps: () => ({
      context: 'HTTP',
    }),
  },
};

async function createLogger(): Promise<Logger> {
  @Module({
    imports: [LoggerModule.forRoot(process.env.NODE_ENV === 'production' ? pinoProd : pinoDev)],
  })
  class TempModule {}

  const tempApp = await NestFactory.createApplicationContext(TempModule, {
    logger: false,
    abortOnError: false,
  });
  await tempApp.close();
  return tempApp.get(Logger);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: await createLogger(),
  });
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // ATTENTION! This call must come before all app.use(...)
  app.use(helmet());

  const configService = app.get(ConfigService);

  const globalPrefix = await configService.get('prefix');

  app.enableCors();
  app.setGlobalPrefix(globalPrefix);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const port = configService.get('port');

  setupSwagger(app, port);

  await app.listen(port);
}

bootstrap();
