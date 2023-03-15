import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { IMAGES_UPLOAD_FOLDER } from '../../config/images_constants';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { imageStorageBuilder } from './imageStorageBuilder';

@Module({
  imports: [MulterModule.register(imageStorageBuilder(IMAGES_UPLOAD_FOLDER))],
  providers: [ImagesService, JwtStrategy],
  controllers: [ImagesController],
})
export class ImagesModule {}
