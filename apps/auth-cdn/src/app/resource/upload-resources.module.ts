import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { setFilenameHelper } from './helpers/set-filename.helper';
import { Configuration } from '../config/config';

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          storage: diskStorage({
            destination: configService.get<Configuration['fileStoragePath']>('fileStoragePath'),
            filename: setFilenameHelper,
          }),
        };
      },
    }),
  ],
  exports: [MulterModule],
})
export class UploadResourcesModule {}
