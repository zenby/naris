import { Injectable } from '@nestjs/common';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { readdir, stat } from 'fs/promises';
import { join, resolve } from 'path';

const dirname = join(__dirname, '/assets');

const delimiter = '^';

type Resource = {
  title: string;
  // url: string;
  children?: Resource[];
};

@Injectable()
export class ResourceService {
  async saveFile(file: Express.Multer.File): Promise<{ uri: string }> {
    // await save file to DB
    return { uri: `/${file.filename}` };
  }

  async getAll(): Promise<Resource[]> {
    const files = await this.getFilenames(dirname);
    return this.cookResources(files);
  }

  public cookResources(files: string[]): Resource[] {
    return this.mergeResources(files.map((file) => this.parseAssetsFilename(file)));
  }

  private mergeResources(resources: Resource[]) {
    const mergedResults: Resource[] = [];

    for (const resource of resources) {
      if (resource.children) {
        const existingFolder = mergedResults.find((r) => r.title === resource.title);
        if (existingFolder) {
          existingFolder.children = this.mergeResources([...existingFolder.children, ...resource.children]);
        } else {
          mergedResults.push(resource);
        }
      } else {
        mergedResults.push(resource);
      }
    }

    return mergedResults;
  }

  private parseAssetsFilename(filename: string): Resource {
    if (!filename.includes(delimiter)) return this.createResource(filename);

    const delimiterIndex = filename.indexOf(delimiter);
    const folderName = filename.substring(0, delimiterIndex);
    const childrenName = filename.substring(delimiterIndex + 1);
    const childrenResource = this.parseAssetsFilename(childrenName);

    return this.createResource(folderName, [childrenResource]);
  }

  private createResource(filename: string, children?: Resource[]): Resource {
    return {
      title: filename,
      // url: filename,
      ...(children ? { children } : {}),
    };
  }

  private async getFilenames(dir: string) {
    const files = [];
    try {
      const filenames = await readdir(dir);

      for (let i = 0; i < filenames.length; i++) {
        const filename = filenames[i];
        const filepath = resolve(dir, filename);
        const fileStats = await stat(filepath);

        if (fileStats.isFile()) {
          files.push(filename);
        }
      }

      return files;
    } catch (error) {
      console.error(error);
    }
  }

  // TODO: it is necessary to move this function into a separate module, because I create it in every task
  prepareResponse<T>(status: HttpJsonStatus, data: T): HttpJsonResult<T> {
    return { status, items: Array.isArray(data) ? data : [data] };
  }
}
