import { Module } from '@nestjs/common';
import { ResourceController } from '../resource.controller';
import { ResourceService } from '../resource.service';
import { ResourceRepository } from '../resource.repository';
import { UploadResourcesModule } from '../upload-resources.module';
import { TestResourceRepository } from './resource.test.repository';

@Module({
  imports: [UploadResourcesModule],
  controllers: [ResourceController],
  providers: [
    ResourceService,
    TestResourceRepository,
    {
      provide: ResourceRepository,
      useClass: TestResourceRepository,
    },
  ],
})
export class TestResourceModule {}
