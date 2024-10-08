import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurationFactory, typeOrmFactory } from './config/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JsonModule } from './modules/json/json.module';
import { ImagesModule } from './modules/images/images.module';
import { JwtConfig } from './config/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { QuestionsModule } from './modules/questions/questions.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
      load: [configurationFactory, JwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmFactory,
      inject: [ConfigService],
    }),
    JsonModule,
    ImagesModule,
    QuestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
