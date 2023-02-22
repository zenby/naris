import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { imageStorageBuilder } from './imageStorageBuilder';

@Module({
  imports: [MulterModule.register(imageStorageBuilder('./images'))],
  providers: [ImagesService],
  controllers: [ImagesController],
})
export class ImagesModule {}
