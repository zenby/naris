import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { setFilenameHelper } from './resource/helpers/set-filename.helper';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          storage: diskStorage({
            destination: configService.get<string>('fileStoragePath'),
            filename: setFilenameHelper,
          }),
        };
      },
    }),
  ],
  exports: [MulterModule],
})
export class UploadResourcesModule {}
