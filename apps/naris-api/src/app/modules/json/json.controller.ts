import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { JsonService } from './json.service';
import { JsonEntity } from './json.entity';
import { CreateJsonDto } from './dto/create-json.dto';
import { HttpJsonResponse, HttpJsonStatus } from '../../common/types/http-json-response.interface';
import { UpdateJsonDto } from './dto/update-json.dto';
import { JsonParams } from './types/json-params.type';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JsonResponseDto } from './dto/json-response.dto';

@Controller({ version: '3', path: 'json/:documentGroup' })
export class JsonController {
  constructor(private readonly jsonService: JsonService) {}

  @ApiOperation({ summary: 'Get all', description: 'Get a list of documents of a specific group' })
  @ApiOkResponse({ type: JsonResponseDto })
  @Get()
  async getAll(@Param('documentGroup') documentGroup: string): Promise<HttpJsonResponse<JsonEntity>> {
    try {
      const documents = await this.jsonService.getAll(documentGroup);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, documents);
    } catch (e) {
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }

  @ApiOperation({ summary: 'Create', description: 'Create a document that belongs to a specific group' })
  @ApiCreatedResponse({ type: JsonResponseDto })
  @Post('new')
  async createJson(
    @Param('documentGroup') documentGroup: string,
    @Body() createJsonDto: CreateJsonDto
  ): Promise<HttpJsonResponse<JsonEntity>> {
    try {
      const document = await this.jsonService.createJson(documentGroup, createJsonDto);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, [document]);
    } catch (e) {
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }

  @ApiOperation({ summary: 'Get one', description: 'Getting a document by id and belonging to a specific group' })
  @ApiOkResponse({ type: JsonResponseDto })
  @ApiParam({ name: 'documentGroup' })
  @ApiParam({ name: 'documentId' })
  @Get(':documentId')
  async findOne(@Param() params: JsonParams): Promise<HttpJsonResponse<JsonEntity>> {
    try {
      const document = await this.jsonService.findOne(params.documentGroup, +params.documentId);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, [document]);
    } catch (e) {
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
  @Put(':documentId')
  async updateJson(
    @Param() params: JsonParams,
    @Body() updateJsonDto: UpdateJsonDto
  ): Promise<HttpJsonResponse<JsonEntity>> {
    try {
      const document = await this.jsonService.update(+params.documentId, params.documentGroup, updateJsonDto);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, [document]);
    } catch (e) {
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
  @Delete(':documentId')
  async deleteJson(@Param() params: JsonParams): Promise<HttpJsonResponse<JsonEntity>> {
    try {
      await this.jsonService.delete(+params.documentId, params.documentGroup);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, []);
    } catch (e) {
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }
}
