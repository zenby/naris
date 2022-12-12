import { Controller, HttpException, HttpStatus, Logger, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { join } from 'path';
import { setFilenameHelper } from './helpers/set-filename.helper';
import { UploadService } from './upload.service';
import { HttpJsonResult, HttpJsonStatus } from '../common/types/http-json-result.interface';

import { uploadResponseSchema } from './doc/upload-response.schema';
import { uploadBodySchema } from './doc/upload-body.schema';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: uploadBodySchema })
  @ApiCreatedResponse({ schema: uploadResponseSchema })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '../../../', 'apps/auth-cdn/src/assets'),
        filename: setFilenameHelper,
      }),
    })
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<HttpJsonResult<{ uri: string }>> {
    try {
      const response = await this.uploadService.saveFile(file);

      return this.uploadService.prepareResponse(HttpJsonStatus.Ok, response);
    } catch (e) {
      Logger.error(e);
      throw new HttpException(e.message, e?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
