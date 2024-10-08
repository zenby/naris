import { Logger } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const SWAGGER_PREFIX = 'swagger';

export function setupSwagger(app: INestApplication, port: string) {
  const config = new DocumentBuilder()
    .setTitle('Auth CDN')
    .setDescription('Auth-cdn API description')
    .setVersion('0.1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter auth token',
        in: 'header',
      },
      'Authorization'
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PREFIX, app, document);

  Logger.log(`Swagger is running on: http://localhost:${port}/${SWAGGER_PREFIX}`);
}
