import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { JsonService } from './json.service';
import { JsonEntity } from './json.entity';
import { CreateJsonDto } from './dto/create-json.dto';
import { HttpJsonResponse, HttpJsonStatus } from '../common/types/http-json-response.interface';
import { UpdateJsonDto } from './dto/update-json.dto';
import { JsonParams } from './types/json-params.type';

@Controller({ version: '3', path: 'json/:documentGroup' })
export class JsonController {
  constructor(private readonly jsonService: JsonService) {}

  @Get()
  async getAll(@Param('documentGroup') documentGroup: string): Promise<HttpJsonResponse<JsonEntity>> {
    try {
      const documents = await this.jsonService.getAll(documentGroup);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, documents);
    } catch (e) {
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }

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

  @Get(':documentId')
  async findOne(@Param() params: JsonParams): Promise<HttpJsonResponse<JsonEntity>> {
    try {
      const document = await this.jsonService.findOne(params.documentGroup, +params.documentId);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, [document]);
    } catch (e) {
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }

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
