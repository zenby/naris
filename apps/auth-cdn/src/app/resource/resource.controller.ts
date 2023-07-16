import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  ParseFilePipe,
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
import { OriginalFilenameValidator } from './validators/original-filename-validator';
import { FilePathDto } from './dto/file-path.dto';
import { ResourcesQueryDto } from './dto/resources-query.dto';

@UsePipes(new ValidationPipe())
@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(new ParseFilePipe({ validators: [new OriginalFilenameValidator({})] })) file: Express.Multer.File,
    @Body() _body: FilePathDto
  ): Promise<HttpJsonResult<{ uri: string }>> {
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
      const resources =
        !query.filename && !query.folder
          ? await this.resourceService.getAll()
          : await this.resourceService.getFilteredResources(query);

      return this.prepareResponse(HttpJsonStatus.Ok, resources);
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
