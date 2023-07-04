import {
  Body,
  Controller,
  Get,
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
  constructor(private readonly resourceService: ResourceService) {}

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
      const response = await this.resourceService.saveFile(file);

      return this.resourceService.prepareResponse(HttpJsonStatus.Ok, response);
    } catch (e) {
      Logger.error(e);
      throw new HttpException(e.message, e?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getAllResources(): Promise<HttpJsonResult<string[]>> {
    try {
      const resources = await this.resourceService.getAll();

      return this.resourceService.prepareResponse(HttpJsonStatus.Ok, resources);
    } catch (e) {
      Logger.error(e);
      throw new HttpException(e.message, e?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
