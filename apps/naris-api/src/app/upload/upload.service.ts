import { Injectable } from '@nestjs/common';
import { HttpJsonResult, HttpJsonStatus } from '../common/types/http-json-result.interface';

@Injectable()
export class UploadService {
  prepareResponse<T>(status: HttpJsonStatus, data: T): HttpJsonResult<T> {
    return { status, items: Array.isArray(data) ? data : [data] };
  }
}
