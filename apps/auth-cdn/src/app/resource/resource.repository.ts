import { Injectable } from '@nestjs/common';
import { readdir, stat } from 'fs/promises';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/config';

@Injectable()
export class ResourceRepository {
  private readonly pathToAssets: string;

  constructor(readonly configService: ConfigService) {
    this.pathToAssets = configService.get<Configuration['fileStoragePath']>('fileStoragePath');
  }

  async getFilenames() {
    const files = [];
    try {
      const filenames = await readdir(this.pathToAssets);

      for (let i = 0; i < filenames.length; i++) {
        const filename = filenames[i];
        const filepath = resolve(this.pathToAssets, filename);
        const fileStats = await stat(filepath);

        if (fileStats.isFile() && filename !== '.gitkeep') {
          files.push(filename);
        }
      }

      return files;
    } catch (error) {
      console.error(error);
    }
  }
}
