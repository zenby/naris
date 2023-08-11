import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { Configuration } from '../../config/config';
import { uploadHandler } from '../helpers/upload-handler';

import { TestStorageEngine } from './storage_engine.test.class';

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          storage: new TestStorageEngine(
            configService.get<Configuration['fileStoragePath']>('fileStoragePath'),
            uploadHandler
          ),
        };
      },
    }),
  ],
  exports: [MulterModule],
})
export class TestUploadResourcesModule {}
