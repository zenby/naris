import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configurationFactory } from './config/config';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessTokenMiddleware } from './common/middlewares/jwt-access-token.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
      load: [configurationFactory],
    }),
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtAccessTokenMiddleware).forRoutes('/');
  }
}
