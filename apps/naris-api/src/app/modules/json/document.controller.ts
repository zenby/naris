import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JsonService } from './json.service';
import { JsonEntity } from './json.entity';
import { HttpJsonResult, HttpJsonStatus, ManifestNamespace, UserManifest, UserRole } from '@soer/sr-common-interfaces';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JsonResponseDto } from './dto/json-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DocumentAuthorGuard } from '../../common/guards/document-author.guard';
import { PatchDocumentPropertiesDto } from './dto/patch-document-properties.dto';
import { AccessTag } from './types/json.const';
import { GetUserManifest, User, UserManifestGuard } from '@soer/sr-auth-nest';

@Controller({ version: '1', path: 'document/:documentId' })
export class DocumentController {
  constructor(private readonly jsonService: JsonService) {}

  private logger = new Logger(DocumentController.name);

  @ApiOperation({
    summary: 'Find document by id',
  })
  @ApiOkResponse({ type: JsonResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, UserManifestGuard)
  @Get('')
  async setDocumentById(
    @Param('documentId') id: string,
    @User() user: { email: string },
    @GetUserManifest() manifest: UserManifest
  ): Promise<HttpJsonResult<JsonEntity>> {
    try {
      const document = await this.jsonService.findDocumentById(parseInt(id, 10));
      const isAuthor = await this.jsonService.isUserAuthorOfDocument(parseInt(id, 10), user.email);
      if (
        isAuthor ||
        this.jsonService.accessTagGuard(
          AccessTag[manifest.role as AccessTag] || AccessTag.PUBLIC,
          AccessTag[document.accessTag as AccessTag] || AccessTag.PRIVATE
        )
      ) {
        return this.jsonService.prepareResponse(HttpJsonStatus.Ok, [document]);
      }
      throw new ForbiddenException('Необходим доступ не ниже ' + document.accessTag);
    } catch (e) {
      this.logger.error(e);
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, [e.message]);
    }
  }

  @ApiOperation({
    summary: 'Patch document by id (for Owner)',
  })
  @ApiOkResponse({ type: JsonResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, DocumentAuthorGuard)
  @Patch('')
  async patchDocument(
    @Param('documentId') id: string,
    @Body() newData: PatchDocumentPropertiesDto
  ): Promise<HttpJsonResult<JsonEntity>> {
    try {
      const document = await this.jsonService.patchDocument(parseInt(id, 10), newData);
      if (!(document instanceof Error)) {
        return this.jsonService.prepareResponse(HttpJsonStatus.Ok, [document]);
      }
    } catch (e) {
      this.logger.error(e);
    }
    return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
  }
}
