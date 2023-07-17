import { Module } from '@nestjs/common';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { UploadResourcesModule } from './upload-resources.module';
import { ResourceRepository } from './resource.repository';

@Module({
  imports: [UploadResourcesModule],
  controllers: [ResourceController],
  providers: [ResourceService, ResourceRepository],
})
export class ResourceModule {}
