import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { UploadModule } from './upload/upload.module';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configurationFactory } from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
      load: [configurationFactory],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'apps/auth-cdn/src/assets'),
    }),
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
