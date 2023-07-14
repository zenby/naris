import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { ResourceService } from './resource.service';
import { Resource } from './resource.model';
import { OriginalFilenameValidator } from './validators/originalFilenameValidator';
import { FilePathDto } from './dto/filePath.dto';

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
  async getAllResources(): Promise<HttpJsonResult<Resource[]>> {
    try {
      const resources = await this.resourceService.getAll();

      return this.prepareResponse(HttpJsonStatus.Ok, resources);
    } catch (e) {
      Logger.error(e);
      throw new HttpException(e.message, e?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':resourceId')
  async getResource(/*@Res() res: Response, */ @Param() params: { resourceId: string }) {
    try {
      console.log('get resource', params.resourceId);

      const resources = await this.resourceService.getFilesByPattern(params.resourceId);

      return this.prepareResponse(HttpJsonStatus.Ok, resources);
      // return res.redirect(`/uploads/${params.resourceId}`);
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
