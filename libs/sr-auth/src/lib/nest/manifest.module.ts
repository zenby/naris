import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ManifestService } from './manifest.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [ManifestService],
})
export class ManifestModule {}
