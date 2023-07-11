import { Module } from '@nestjs/common';
import { ManifestService } from './manifest.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ManifestService],
})
export class ManifestModule {}
