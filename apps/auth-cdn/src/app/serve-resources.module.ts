import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Configuration } from './config/config';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // path to files
        const rootPath = configService.get<Configuration['fileStoragePath']>('fileStoragePath');
        // path in URL
        const serveRoot = `/${configService.get<Configuration['serveUploadsRoute']>('serveUploadsRoute')}`;

        return [
          {
            rootPath,
            serveRoot,
          },
        ];
      },
    }),
  ],
})
export class ServeResourcesModule {}
