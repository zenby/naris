import { Module } from '@nestjs/common';
import { ResourceController } from '../resource.controller';
import { ResourceService } from '../resource.service';
import { ResourceRepository } from '../resource.repository';
import { TestUploadResourcesModule } from './upload-resources.test.module';
import { TestResourceRepository } from './resource.test.repository';

@Module({
  imports: [TestUploadResourcesModule],
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
