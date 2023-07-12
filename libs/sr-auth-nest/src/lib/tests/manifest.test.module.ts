import { HttpModule, HttpService } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { ManifestModuleOptions } from '../manifest.interface';
import { ManifestService } from '../manifest.service';
import { RolesAuthGuard } from '../roles-auth.guard';
import { UserManifestGuard } from '../user-manifest.guard';

@Module({
  imports: [HttpModule],
  providers: [ManifestService],
  exports: [ManifestService],
})
export class ManifestTestModule {
  public static forRoot(options: ManifestModuleOptions): DynamicModule {
    return {
      module: ManifestTestModule,
      imports: [HttpModule],
      providers: [
        {
          provide: ManifestService,
          useFactory: (http: HttpService) => new ManifestService(http, options),
          inject: [HttpService],
        },
        UserManifestGuard,
        RolesAuthGuard,
      ],
      exports: [ManifestService],
    };
  }
}
