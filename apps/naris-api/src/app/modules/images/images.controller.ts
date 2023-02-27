import { Controller, HttpCode, HttpException, HttpStatus, Post, UseInterceptors, UploadedFiles, } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MAX_IMAGE_FILE_SIZE_MB} from './constants'
import { uploadImagesBodySchema } from './docs/upload-images-body.schema'

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(201)
  @ApiConsumes('multipart/form-data')
  @ApiBody(uploadImagesBodySchema )
  @ApiOperation({ summary: 'Upload Images', description: `max file size: ${MAX_IMAGE_FILE_SIZE_MB}Mb. Allowed mimeTypes: 'image/*'` })
  @ApiResponse({
    status: 201,
    description: 'Response contain array of full paths uploaded images',
    type: Array<string>,
  })
  saveImages(
    @UploadedFiles()
    files: Express.Multer.File[]
  ) {
    try {
      const paths: string[] = this.imagesService.getPathsToSavedImages(files);
      return paths;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
