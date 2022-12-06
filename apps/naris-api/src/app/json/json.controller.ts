import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { JsonService } from './json.service';
import { JsonEntity } from './json.entity';
import { CreateJsonDto } from './dto/create-json.dto';
import { HttpJsonResponse, HttpJsonStatus } from '../common/types/http-json-response.interface';
import { UpdateJsonDto } from './dto/update-json.dto';

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

  @Get(':id')
  async findOne(@Param() params: Record<'documentGroup' | 'id', string>): Promise<HttpJsonResponse<JsonEntity>> {
    try {
      const document = await this.jsonService.findOne(params.documentGroup, +params.id);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, [document]);
    } catch (e) {
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }

  @Put(':id')
  async updateJson(
    @Param() params: Record<'documentGroup' | 'id', string>,
    @Body() updateJsonDto: UpdateJsonDto
  ): Promise<HttpJsonResponse<JsonEntity>> {
    try {
      const document = await this.jsonService.update(+params.id, params.documentGroup, updateJsonDto);

      return this.jsonService.prepareResponse(HttpJsonStatus.Ok, [document]);
    } catch (e) {
      return this.jsonService.prepareResponse(HttpJsonStatus.Error, []);
    }
  }
}
