import { v4 as uuidv4 } from 'uuid';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { MAX_IMAGE_FILE_SIZE_MB } from '../../config/images_constants';

export function imageStorageBuilder(folderPath: string, maxFileSizeMB = MAX_IMAGE_FILE_SIZE_MB): MulterOptions {
  const limits: MulterOptions['limits'] = {
    fileSize: maxFileSizeMB * 1024 * 1024,
  };

  const fileFilter: MulterOptions['fileFilter'] = (_req, file, cb) => {
    const regex = new RegExp('^image/', 'i');
    const isImageFile = regex.test(file.mimetype);
    cb(null, isImageFile);
  };

  const storage = diskStorage({
    destination: async function (_req, _file, cb) {
      try {
        await fs.readdir(folderPath);
      } catch (e) {
        if (e.code === 'ENOENT') await fs.mkdir(folderPath);
      }
      cb(null, folderPath);
    },
    filename: function (_req, file, cb) {
      cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
    },
  });
  return { storage, limits, fileFilter };
}
