import { Injectable } from '@nestjs/common';
import { files } from './test.resources';

@Injectable()
export class TestResourceRepository {
  private readonly files = files;

  async getFilenames() {
    return this.files;
  }
}
