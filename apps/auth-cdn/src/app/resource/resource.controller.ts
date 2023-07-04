import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { setFilenameHelper } from './helpers/set-filename.helper';
import { ResourceService } from './resource.service';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';

@Controller('resource')
export class ResourceController {
  constructor(private readonly ResourceService: ResourceService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '../../../', 'apps/auth-cdn/src/assets'),
        filename: setFilenameHelper,
      }),
    })
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { path: string }
  ): Promise<HttpJsonResult<{ uri: string }>> {
    try {
      console.log(file);
      console.log(body.path);
      const response = await this.ResourceService.saveFile(file);

      return this.ResourceService.prepareResponse(HttpJsonStatus.Ok, response);
    } catch (e) {
      console.log(e);
      Logger.error(e);
      throw new HttpException(e.message, e?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
