import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BasicAuthMiddleware } from './common/middlewares/auth.middleware';
import { configurationFactory } from './config/config';
import { ResourceModule } from './resource/resource.module';
import { ServeResourcesModule } from './serve-resources.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
      load: [configurationFactory],
    }),
    ServeResourcesModule,
    ResourceModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BasicAuthMiddleware).forRoutes('/');
  }
}
