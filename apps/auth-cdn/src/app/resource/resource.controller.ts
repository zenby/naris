import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { Response } from 'express';
import { ResourceService } from './resource.service';

@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<HttpJsonResult<{ uri: string }>> {
    try {
      const data = await this.resourceService.saveFile(file);

      return this.prepareResponse(HttpJsonStatus.Ok, data);
    } catch (e) {
      Logger.error(e);
      throw new HttpException(e.message, e?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getAllResources(): Promise<HttpJsonResult<any[]>> {
    try {
      const resources = await this.resourceService.getAll();

      return this.prepareResponse(HttpJsonStatus.Ok, resources);
    } catch (e) {
      Logger.error(e);
      throw new HttpException(e.message, e?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':resourceId')
  async getResource(@Res() res: Response, @Param() params: { resourceId: string }) {
    try {
      console.log('get resource', params.resourceId);
      return res.redirect(`/uploads/${params.resourceId}`);
    } catch (e) {
      Logger.error(e);
      throw new HttpException(e.message, e?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // TODO: it is necessary to move this function into a separate module, because I create it in every task
  private prepareResponse<T>(status: HttpJsonStatus, data: T): HttpJsonResult<T> {
    return { status, items: Array.isArray(data) ? data : [data] };
  }
}
