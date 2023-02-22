import * as Path from 'node:path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagesService {
  getPathsToSavedImages(files: Express.Multer.File[]): string[] {
    return files.map((f) => Path.normalize(f.path));
  }
}
