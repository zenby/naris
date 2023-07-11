import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards } from '@nestjs/common';
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
import { NamespacesForViewerRole, Roles, RolesAuthGuard, UserManifestGuard } from '@soer/sr-auth/nest';

@Controller({ version: '3', path: 'json/:documentNamespace' })
export class JsonController {
  constructor(private readonly jsonService: JsonService) {}

  private logger = new Logger(JsonController.name);

  @NamespacesForViewerRole(ManifestNamespace.WORKSHOP)
  @Roles(UserRole.ADMIN, DynamicRole.VIEWER, DynamicRole.OWNER)
  @UseGuards(UserManifestGuard, RolesAuthGuard)
  @Get('test')
  async test() {
    return 'test';
  }
  @ApiOperation({
    summary: 'Find documents from the namespace with the "public" tag',
  })
  @ApiOkResponse({ type: JsonResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('public')
  async findPublicDocuments(
    @AuthUser() user: JwtPayload,
    @Param('documentNamespace') documentNamespace: string
  ): Promise<HttpJsonResult<JsonEntity>> {
    try {
      const documents = await this.jsonService.findPublicDocuments(documentNamespace);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, documents);
    } catch (e) {
      this.logger.error(e);
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }

  @ApiOperation({
    summary: 'Find documents authored by the current user',
  })
  @ApiOkResponse({ type: JsonResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('private')
  async findCurrentUserDocuments(
    @AuthUser() user: JwtPayload,
    @Param('documentNamespace') documentNamespace: string
  ): Promise<HttpJsonResult<JsonEntity>> {
    try {
      const documents = await this.jsonService.findCurrentUserDocuments(documentNamespace, user.email);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, documents);
    } catch (e) {
      this.logger.error(e);
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }

  @ApiOperation({
    summary: 'Find documents from the namespace with both private and public access',
  })
  @ApiOkResponse({ type: JsonResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async findPrivateAndPublicDocuments(
    @AuthUser() user: JwtPayload,
    @Param('documentNamespace') documentNamespace: string
  ): Promise<HttpJsonResult<JsonEntity>> {
    try {
      const documents = await this.jsonService.findPrivateAndPublicDocuments(documentNamespace);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, documents);
    } catch (e) {
      this.logger.error(e);
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }

  @ApiOperation({
    summary: 'Updates the value of accessTag to private/public',
  })
  @ApiOkResponse({ type: JsonResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':documentId/accessTag')
  async switchAccessTag(
    @AuthUser() user: JwtPayload,
    @Param() params: JsonParams
  ): Promise<HttpJsonResult<JsonEntity>> {
    try {
      const document = await this.jsonService.switchAccessTag(+params.documentId, params.documentNamespace, user.email);
      if (document instanceof Error) throw document;

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, [document]);
    } catch (e) {
      this.logger.error(e);
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }

  @ApiOperation({ summary: 'Get all', description: 'Get a list of documents of a specific group' })
  @ApiOkResponse({ type: JsonResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Param('documentNamespace') documentNamespace: string): Promise<HttpJsonResult<JsonEntity>> {
    try {
      const documents = await this.jsonService.getAll(documentNamespace);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, documents);
    } catch (e) {
      this.logger.error(e);
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }

  @ApiOperation({ summary: 'Create', description: 'Create a document that belongs to a specific group' })
  @ApiCreatedResponse({ type: JsonResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('new')
  async createJson(
    @AuthUser() user: JwtPayload,
    @Param('documentNamespace') documentNamespace: string,
    @Body() createJsonDto: CreateJsonDto
  ): Promise<HttpJsonResult<JsonEntity>> {
    try {
      const document = await this.jsonService.createJson(user.email, documentNamespace, createJsonDto);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, [document]);
    } catch (e) {
      this.logger.error(e);
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }

  @ApiOperation({ summary: 'Get empty list', description: 'Empty list of elements' })
  @ApiOkResponse({ type: JsonResponseDto })
  @ApiParam({ name: 'documentNamespace' })
  @ApiBearerAuth()
  //  @UseGuards(JwtAuthGuard)
  @Get('new')
  async newItems(): Promise<HttpJsonResult<JsonEntity>> {
    return this.jsonService.prepareResponse(HttpJsonStatus.Ok, []);
  }

  @ApiOperation({ summary: 'Get one', description: 'Getting a document by id and belonging to a specific group' })
  @ApiOkResponse({ type: JsonResponseDto })
  @ApiParam({ name: 'documentNamespace' })
  @ApiParam({ name: 'documentId' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':documentId')
  async findOne(@Param() params: JsonParams): Promise<HttpJsonResult<JsonEntity>> {
    try {
      const document = await this.jsonService.findOne(params.documentNamespace, +params.documentId);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, [document]);
    } catch (e) {
      this.logger.error(e);
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }

  @ApiOperation({
    summary: 'Update',
    description: 'Change a document with a specific id belonging to a specific category',
  })
  @ApiOkResponse({ type: JsonResponseDto })
  @ApiParam({ name: 'documentNamespace' })
  @ApiParam({ name: 'documentId' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, DocumentAuthorGuard)
  @Put(':documentId')
  async updateJson(
    @Param() params: JsonParams,
    @Body() updateJsonDto: UpdateJsonDto
  ): Promise<HttpJsonResult<JsonEntity>> {
    try {
      const document = await this.jsonService.update(+params.documentId, params.documentNamespace, updateJsonDto);
      if (document instanceof Error) throw document;

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, [document]);
    } catch (e) {
      this.logger.error(e);
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }

  @ApiOperation({
    summary: 'Delete',
    description: 'Delete a document with a specific id belonging to a specific category',
  })
  @ApiOkResponse({ type: JsonResponseDto })
  @ApiParam({ name: 'documentNamespace' })
  @ApiParam({ name: 'documentId' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, DocumentAuthorGuard)
  @Delete(':documentId')
  async deleteJson(@Param() params: JsonParams): Promise<HttpJsonResult<JsonEntity>> {
    try {
      const result = await this.jsonService.delete(+params.documentId, params.documentNamespace);
      if (result instanceof Error) throw result;

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, []);
    } catch (e) {
      this.logger.error(e);
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }
}
