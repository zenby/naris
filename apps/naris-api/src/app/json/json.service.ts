import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonEntity } from './json.entity';
import { Repository } from 'typeorm';
import { ResponseInterface } from '../common/response.interface';
import { CreateJsonDto } from './dto/create-json.dto';

@Injectable()
export class JsonService {
  constructor(
    @InjectRepository(JsonEntity)
    private readonly jsonRepository: Repository<JsonEntity>
  ) {}

  async getAll(documentGroup: string): Promise<JsonEntity[]> {
    return this.jsonRepository.find({ where: { group: documentGroup } });
  }

  async createJson(documentGroup: string, createJsonDto: CreateJsonDto) {
    const document = new JsonEntity();

    Object.assign(document, createJsonDto);

    document.group = documentGroup;

    return await this.jsonRepository.save(document);
  }

  async findOne(documentGroup: string, id: number): Promise<JsonEntity> {
    const document = await this.jsonRepository.findOne({ where: { id, group: documentGroup } });

    if (!document) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }

    return document;
  }

  prepareResponse(list: JsonEntity[]): ResponseInterface<JsonEntity[]> {
    return { status: 'ok', items: list };
  }
}
