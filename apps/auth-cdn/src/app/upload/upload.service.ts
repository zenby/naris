import { Injectable } from '@nestjs/common';
import { HttpJsonResult, HttpJsonStatus } from '../common/types/http-json-result.interface';

@Injectable()
export class UploadService {
  async saveFile(file: Express.Multer.File): Promise<{ uri: string }> {
    // await save file to DB
    return { uri: `/${file.filename}` };
  }

  // TODO: it is necessary to move this function into a separate module, because I create it in every task
  prepareResponse<T>(status: HttpJsonStatus, data: T): HttpJsonResult<T> {
    return { status, items: Array.isArray(data) ? data : [data] };
  }
}
