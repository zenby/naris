import { Controller, Get, Param } from '@nestjs/common';
import { JsonService } from './json.service';
import { ResponseInterface } from '../common/response.interface';
import { JsonEntity } from './json.entity';

@Controller({ version: '3', path: 'json/:documentGroup' })
export class JsonController {
  constructor(private readonly jsonService: JsonService) {}

  @Get()
  async getAll(@Param('documentGroup') documentGroup: string): Promise<ResponseInterface<JsonEntity[]>> {
    const list = await this.jsonService.getAll(documentGroup);
    return this.jsonService.prepareResponse(list);
  }
}
