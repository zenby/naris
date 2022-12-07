import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { getFilenameHelper } from './helpers/get-filename.helper';
import { UploadService } from './upload.service';
import { HttpJsonStatus } from '../common/types/http-json-result.interface';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: `${join(__dirname, '../../../')}apps/naris-api/src/assets`,
        filename: getFilenameHelper,
      }),
    })
  )
  async uploadFiles(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.prepareResponse(HttpJsonStatus.Ok, file.filename);
  }
}
