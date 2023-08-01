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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { uploadBodySchema } from './doc/upload-body.schema';
import { errorResponseSchema } from './doc/error-response.schema';
import { uploadResponseSchema } from './doc/upload-response.schema';
import { getResourceSchema } from './doc/get-response.schema';

@ApiTags('resources')
@UsePipes(new ValidationPipe())
@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @ApiBearerAuth('Authorization')
  @ApiConsumes('multipart/form-data')
  @ApiBody(uploadBodySchema)
  @ApiResponse({ status: 201, description: 'The resource has successfully been created', schema: uploadResponseSchema })
  @ApiResponse({ status: 403, description: 'Anauthorized', schema: errorResponseSchema })
  @ApiResponse({ status: 400, description: 'Bad request', schema: errorResponseSchema })
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

  @ApiOperation({
    summary: 'Get resources',
    description: 'Get resources filtered by filename and/or foldername',
  })
  @ApiBearerAuth('Authorization')
  @ApiResponse({ status: 200, description: 'The results has successfully been return', schema: getResourceSchema })
  @ApiResponse({ status: 403, description: 'Anauthorized', schema: errorResponseSchema })
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
