import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configurationFactory } from './config/config';
import { JwtService } from '@nestjs/jwt';
// import { JwtAccessTokenMiddleware } from './common/middlewares/jwt-access-token.middleware';
import { ResourceModule } from './resource/resource.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
      load: [configurationFactory],
    }),
    ResourceModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule implements NestModule {
  configure(_consumer: MiddlewareConsumer) {
    // consumer.apply(JwtAccessTokenMiddleware).forRoutes('/');
  }
}
