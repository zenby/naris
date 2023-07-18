import { Injectable } from '@nestjs/common';
import { FileResource, FolderResource, Resource, ResourceFilter, isFolderResource } from './resource.model';
import { DELIMETERS } from './constants';
import { ResourceRepository } from './resource.repository';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/config';

@Injectable()
export class ResourceService {
  constructor(private readonly resourceRepository: ResourceRepository, private readonly configService: ConfigService) {}

  async saveFile(file: Express.Multer.File): Promise<{ uri: string }> {
    // await save file to DB
    return { uri: `${this.getFileUrlPrefix()}/${file.filename}` };
  }

  async getResources(filter: ResourceFilter): Promise<Resource[]> {
    let files = await this.resourceRepository.getFilenames();

    if (filter.filename) {
      files = this.filterByFilename(files, filter.filename);
    }

    if (filter.folder) {
      files = this.filterByFolder(files, filter.folder);
    }

    return this.cookResources(files);
  }

  cookResources(files: string[]): Resource[] {
    return this.mergeResources(files.map((file) => this.parseAssetsFilename(file)));
  }

  private filterByFilename(files: string[], search: string): string[] {
    return files.filter((f) => {
      const originalname = this.getOriginalFilename(f);

      if (search.includes(DELIMETERS.SEARCH_ANY_CHAR)) {
        const regexp = this.getMatchByAnySymbolRegex(search);
        return originalname.match(regexp);
      }

      return originalname.includes(search);
    });
  }

  private filterByFolder(files: string[], search: string): string[] {
    return files.filter((f) => {
      const folders = this.getAllFoldersFromFilename(f);

      if (folders.length === 0) return false;

      if (search.includes(DELIMETERS.SEARCH_ANY_CHAR)) {
        const regexp = this.getMatchByAnySymbolRegex(search);
        return folders.some((folder) => folder.match(regexp));
      }

      return folders.some((folder) => folder.includes(search));
    });
  }

  private mergeResources(resources: Resource[]) {
    const mergedResults: Resource[] = [];

    for (const resource of resources) {
      if (isFolderResource(resource)) {
        const existingFolder = mergedResults.find((r) => r.title === resource.title);
        if (isFolderResource(existingFolder)) {
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

  private getMatchByAnySymbolRegex(search: string) {
    return new RegExp(`^${search.replaceAll(DELIMETERS.SEARCH_ANY_CHAR, '.+')}`);
  }

  private parseAssetsFilename(filename: string, prefix = ''): Resource {
    if (!filename.includes(DELIMETERS.FOLDER)) return this.createFileResource({ filename, prefix });

    const delimiterIndex = filename.indexOf(DELIMETERS.FOLDER);
    const newPrefix = prefix + filename.substring(0, delimiterIndex + 1);
    const folderName = this.getFolderName(filename);
    const childrenName = filename.substring(delimiterIndex + 1);
    const childrenResource = this.parseAssetsFilename(childrenName, newPrefix);

    return this.createFolderResource({ folderName, children: [childrenResource] });
  }

  private getFolderName(filename: string): string {
    const delimiterIndex = filename.indexOf(DELIMETERS.FOLDER);
    return filename.substring(0, delimiterIndex);
  }

  private getAllFoldersFromFilename(filename: string): string[] {
    const folders = filename.split(DELIMETERS.FOLDER);
    folders.pop();

    return folders;
  }

  private getOriginalFilename(filename: string): string {
    const delimiterIndex = filename.indexOf(DELIMETERS.NAME);
    return filename.substring(delimiterIndex + 1);
  }

  private createFileResource({ filename, prefix }: { filename: string; prefix: string }): FileResource {
    return {
      title: filename.split(DELIMETERS.NAME)[1],
      url: `${this.getFileUrlPrefix()}/${prefix}${filename}`,
    };
  }

  private createFolderResource({ folderName, children }: { folderName: string; children: Resource[] }): FolderResource {
    return {
      title: folderName,
      children,
    };
  }

  private getFileUrlPrefix() {
    const host = this.configService.get<Configuration['host']>('host');
    const route = this.configService.get<Configuration['serveUploadsRoute']>('serveUploadsRoute');
    return `${host}/${route}`;
  }
}
