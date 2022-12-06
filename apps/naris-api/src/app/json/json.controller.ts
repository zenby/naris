import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { JsonService } from './json.service';
import { JsonEntity } from './json.entity';
import { CreateJsonDto } from './dto/create-json.dto';
import { HttpJsonResponse, HttpJsonStatus } from '../common/types/http-json-response.interface';

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
}
