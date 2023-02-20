import * as Path from 'node:path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagesService {
  async getPathsToSavedImages(files: Express.Multer.File[]): Promise<string[]> {
    return files.map((f) => Path.normalize(f.path));
  }
}
