import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonEntity } from './json.entity';
import { Repository } from 'typeorm';
import { ResponseInterface } from '../common/response.interface';

@Injectable()
export class JsonService {
  constructor(
    @InjectRepository(JsonEntity)
    private readonly jsonRepository: Repository<JsonEntity>
  ) {}

  async getAll(documentGroup: string): Promise<JsonEntity[]> {
    return this.jsonRepository.find({ where: { group: documentGroup } });
  }

  prepareResponse(list: JsonEntity[]): ResponseInterface<JsonEntity[]> {
    return { status: 'ok', items: list };
  }
}
