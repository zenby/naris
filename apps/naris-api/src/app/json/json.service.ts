import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonEntity } from './json.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateJsonDto } from './dto/create-json.dto';
import { HttpJsonResponse, HttpJsonStatus } from '../common/types/http-json-response.interface';
import { UpdateJsonDto } from './dto/update-json.dto';

@Injectable()
export class JsonService {
  constructor(
    @InjectRepository(JsonEntity)
    private readonly jsonRepository: Repository<JsonEntity>
  ) {}

  async getAll(documentGroup: string): Promise<JsonEntity[]> {
    return this.jsonRepository.find({ where: { group: documentGroup } });
  }

  async createJson(documentGroup: string, createJsonDto: CreateJsonDto): Promise<JsonEntity> {
    const document = new JsonEntity();

    Object.assign(document, createJsonDto);

    document.group = documentGroup;

    return await this.jsonRepository.save(document);
  }

  async findOne(documentGroup: string, documentId: number): Promise<JsonEntity> {
    return await this.jsonRepository.findOne({ where: { id: documentId, group: documentGroup } });
  }

  async update(documentId: number, documentGroup: string, updateJsonDto: UpdateJsonDto): Promise<JsonEntity> {
    const document = await this.jsonRepository.findOne({ where: { id: documentId, group: documentGroup } });

    if (!document) {
      throw new HttpException('Document does not exist', HttpStatus.NOT_FOUND);
    }

    Object.assign(document, updateJsonDto);

    return await this.jsonRepository.save(document);
  }

  async delete(documentId: number, documentGroup: string): Promise<DeleteResult> {
    const document = await this.jsonRepository.findOne({ where: { id: documentId, group: documentGroup } });

    if (!document) {
      throw new HttpException('Document does not exist', HttpStatus.NOT_FOUND);
    }

    return await this.jsonRepository.delete({ id: documentId });
  }

  prepareResponse(status: HttpJsonStatus, list: JsonEntity[]): HttpJsonResponse<JsonEntity> {
    return { status, items: list };
  }
}
