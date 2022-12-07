import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { getFilenameHelper } from '../helpers/get-filename.helper';

@Controller('upload')
export class UploadController {
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
    return file;
  }
}
