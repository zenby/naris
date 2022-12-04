import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { JsonService } from './json.service';
import { ResponseInterface } from '../common/response.interface';
import { JsonEntity } from './json.entity';
import { CreateJsonDto } from './dto/create-json.dto';

@Controller({ version: '3', path: 'json/:documentGroup' })
export class JsonController {
  constructor(private readonly jsonService: JsonService) {}

  @Get()
  async getAll(@Param('documentGroup') documentGroup: string): Promise<ResponseInterface<JsonEntity[]>> {
    const list = await this.jsonService.getAll(documentGroup);
    return this.jsonService.prepareResponse(list);
  }

  @Post('new')
  async createJson(
    @Param('documentGroup') documentGroup: string,
    @Body() createJsonDto: CreateJsonDto
  ): Promise<ResponseInterface<JsonEntity[]>> {
    const document = await this.jsonService.createJson(documentGroup, createJsonDto);
    // console.log(document);
    return this.jsonService.prepareResponse([document]);
  }
}
