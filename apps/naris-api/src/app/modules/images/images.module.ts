import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as Path from 'node:path';
import * as fs from 'node:fs/promises';
import { MAX_IMAGE_FILE_SIZE_MB } from './constants';

export function imageStorageBuilder(path: string, maxFileSizeMB = MAX_IMAGE_FILE_SIZE_MB) {
  const limits = {
    fileSize: maxFileSizeMB * 1024 * 1024,
  };

  function fileFilter(_req, file, cb) {
    const regex = new RegExp('^image/', 'i');
    if (regex.test(file.mimetype)) cb(null, true);
    else cb(null, false);
  }

  const storage = diskStorage({
    destination: async function (_req, _file, cb) {
      try {
        await fs.readdir(path);
      } catch (e) {
        if (e.code === 'ENOENT') await fs.mkdir(path);
      }
      cb(null, path);
    },
    filename: function (_req, file, cb) {
      cb(null, `${uuidv4()}${Path.extname(file.originalname)}`);
    },
  });
  return { storage, limits, fileFilter };
}

@Module({
  imports: [MulterModule.register(imageStorageBuilder('./images'))],
  providers: [ImagesService],
  controllers: [ImagesController],
})
export class ImagesModule {}
