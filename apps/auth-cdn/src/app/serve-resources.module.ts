import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot(
      (() => {
        // path to files within dist folder
        const rootPath = join(__dirname, 'assets');
        // path in URL
        const serveRoot = '/uploads';

        return {
          rootPath,
          serveRoot,
        };
      })()
    ),
  ],
})
export class ServeResourcesModule {}
