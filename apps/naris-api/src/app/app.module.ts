import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { configurationFactory, typeOrmFactory } from './config/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JsonModule } from './json/json.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
      load: [configurationFactory],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmFactory,
      inject: [ConfigService],
    }),
    JsonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
