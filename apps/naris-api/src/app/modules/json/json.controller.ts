import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JsonService } from './json.service';
import { JsonEntity } from './json.entity';
import { CreateJsonDto } from './dto/create-json.dto';
import { HttpJsonResponse, HttpJsonStatus } from '../../common/types/http-json-response.interface';
import { UpdateJsonDto } from './dto/update-json.dto';
import { JsonParams } from './types/json-params.type';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JsonResponseDto } from './dto/json-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller({ version: '3', path: 'json/:documentGroup' })
export class JsonController {
  constructor(private readonly jsonService: JsonService) {}

  private logger = new Logger(JsonController.name);

  @ApiOperation({ summary: 'Get all', description: 'Get a list of documents of a specific group' })
  @ApiOkResponse({ type: JsonResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Param('documentGroup') documentGroup: string): Promise<HttpJsonResponse<JsonEntity>> {
    try {
      const documents = await this.jsonService.getAll(documentGroup);

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
    @Param('documentGroup') documentGroup: string,
    @Body() createJsonDto: CreateJsonDto
  ): Promise<HttpJsonResponse<JsonEntity>> {
    try {
      const document = await this.jsonService.createJson(documentGroup, createJsonDto);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, [document]);
    } catch (e) {
      this.logger.error(e);
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }

  @ApiOperation({ summary: 'Get one', description: 'Getting a document by id and belonging to a specific group' })
  @ApiOkResponse({ type: JsonResponseDto })
  @ApiParam({ name: 'documentGroup' })
  @ApiParam({ name: 'documentId' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':documentId')
  async findOne(@Param() params: JsonParams): Promise<HttpJsonResponse<JsonEntity>> {
    try {
      const document = await this.jsonService.findOne(params.documentGroup, +params.documentId);

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
  @ApiParam({ name: 'documentGroup' })
  @ApiParam({ name: 'documentId' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':documentId')
  async updateJson(
    @Param() params: JsonParams,
    @Body() updateJsonDto: UpdateJsonDto
  ): Promise<HttpJsonResponse<JsonEntity>> {
    try {
      const document = await this.jsonService.update(+params.documentId, params.documentGroup, updateJsonDto);

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
  @ApiParam({ name: 'documentGroup' })
  @ApiParam({ name: 'documentId' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':documentId')
  async deleteJson(@Param() params: JsonParams): Promise<HttpJsonResponse<JsonEntity>> {
    try {
      await this.jsonService.delete(+params.documentId, params.documentGroup);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, []);
    } catch (e) {
      this.logger.error(e);
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }
}
