import { Injectable } from '@nestjs/common';
import { promises as fs, constants } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getData(): { message: string } {
    return { message: 'Welcome to auth-cdn!' };
  }

  getFilePath(filename: string): string {
    return join(this.configService.get<string>('fileStoragePath'), filename);
  }

  async isExistFile(path: string): Promise<void> {
    await fs.access(path, constants.F_OK);
  }
}
