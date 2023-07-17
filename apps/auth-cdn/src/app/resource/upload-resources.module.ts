import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Configuration } from '../config/config';
import { uploadHandler } from './helpers/upload-handler';

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          storage: diskStorage({
            destination: configService.get<Configuration['fileStoragePath']>('fileStoragePath'),
            filename: uploadHandler,
          }),
        };
      },
    }),
  ],
  exports: [MulterModule],
})
export class UploadResourcesModule {}
