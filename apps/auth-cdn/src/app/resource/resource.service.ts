import { Injectable } from '@nestjs/common';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { readdir, readFile, stat } from 'fs/promises';
import { join, parse, resolve } from 'path';

const dirname = join(__dirname, '../../../', '/src/assets');

@Injectable()
export class ResourceService {
  async saveFile(file: Express.Multer.File): Promise<{ uri: string }> {
    // await save file to DB
    return { uri: `/${file.filename}` };
  }

  async getAll(): Promise<string[]> {
    return await this.readAllFiles(dirname);
  }

  private async readAllFiles(dir: string) {
    try {
      const filenames = await readdir(dir);

      return filenames;
    } catch (error) {
      console.error(error);
    }
  }

  // TODO: it is necessary to move this function into a separate module, because I create it in every task
  prepareResponse<T>(status: HttpJsonStatus, data: T): HttpJsonResult<T> {
    return { status, items: Array.isArray(data) ? data : [data] };
  }
}
