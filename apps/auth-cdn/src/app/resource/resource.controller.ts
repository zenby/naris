import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { ResourceService } from './resource.service';
import { Resource } from './resource.model';
import { ResourcesQueryDto } from './dto/resources-query.dto';

@UsePipes(new ValidationPipe())
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
  async getResources(@Query() query: ResourcesQueryDto): Promise<HttpJsonResult<Resource[]>> {
    try {
      const resources = await this.resourceService.getResources(query);

      return this.prepareResponse(HttpJsonStatus.Ok, resources);
    } catch (e) {
      Logger.error(e);
      throw new HttpException(e.message, e?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private prepareResponse<T>(status: HttpJsonStatus, data: T): HttpJsonResult<T> {
    return { status, items: Array.isArray(data) ? data : [data] };
  }
}
