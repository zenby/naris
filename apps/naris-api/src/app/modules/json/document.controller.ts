import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { JsonService } from './json.service';
import { JsonEntity } from './json.entity';
import { CreateJsonDto } from './dto/create-json.dto';
import { DynamicRole, HttpJsonResult, HttpJsonStatus, ManifestNamespace, UserRole } from '@soer/sr-common-interfaces';
import { UpdateJsonDto } from './dto/update-json.dto';
import { JsonParams } from './types/json-params.type';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JsonResponseDto } from './dto/json-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtPayload } from '../../common/types/jwt-payload.interface';
import { AuthUser } from '../../common/decorators';
import { DocumentAuthorGuard } from '../../common/guards/document-author.guard';
import { NamespacesForViewerRole, Roles, RolesAuthGuard, UserManifestGuard } from '@soer/sr-auth-nest';
import { AccessTag } from './types/json.const';
import { UpdateAccessTagJsonDto } from './dto/update-accestag-json.dto';
import { PatchDocumentPropertiesDto } from './dto/patch-document-properties.dto';

@Controller({ version: '1', path: 'document/:documentId' })
export class DocumentController {
  constructor(private readonly jsonService: JsonService) {}

  private logger = new Logger(DocumentController.name);

  @ApiOperation({
    summary: 'Find document by id',
  })
  @ApiOkResponse({ type: JsonResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, DocumentAuthorGuard)
  @Get('')
  async getDocumentById(@Param('documentId') id: string): Promise<HttpJsonResult<JsonEntity>> {
    try {
      const document = await this.jsonService.findDocumentById(parseInt(id, 10));

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, [document]);
    } catch (e) {
      this.logger.error(e);
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
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
