import * as path from 'node:path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagesService {
  getPathsToSavedImages(files: Express.Multer.File[]): string[] {
    return files.map((f) => path.normalize(f.path));
  }
}
