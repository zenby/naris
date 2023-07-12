import { Module } from '@nestjs/common';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { UploadResourcesModule } from '../upload-resources.module';

@Module({
  imports: [UploadResourcesModule],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
