import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonEntity } from './json.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateJsonDto } from './dto/create-json.dto';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { UpdateJsonDto } from './dto/update-json.dto';

@Injectable()
export class JsonService {
  constructor(
    @InjectRepository(JsonEntity)
    private readonly jsonRepository: Repository<JsonEntity>
  ) {}

  async getAll(documentNamespace: string): Promise<JsonEntity[]> {
    return this.jsonRepository.find({ where: { namespace: documentNamespace } });
  }

  async createJson(author_email: string, documentNamespace: string, createJsonDto: CreateJsonDto): Promise<JsonEntity> {
    const document = new JsonEntity();

    Object.assign(document, createJsonDto);

    document.namespace = documentNamespace;
    document.author_email = author_email;

    return await this.jsonRepository.save(document);
  }

  async findOne(documentNamespace: string, documentId: number): Promise<JsonEntity> {
    return await this.jsonRepository.findOne({ where: { id: documentId, namespace: documentNamespace } });
  }

  async update(documentId: number, documentNamespace: string, updateJsonDto: UpdateJsonDto): Promise<JsonEntity> {
    const document = await this.jsonRepository.findOne({ where: { id: documentId, namespace: documentNamespace } });

    if (!document) {
      throw new HttpException('Document does not exist', HttpStatus.NOT_FOUND);
    }

    Object.assign(document, updateJsonDto);

    return await this.jsonRepository.save(document);
  }

  async delete(documentId: number, documentNamespace: string): Promise<DeleteResult> {
    const document = await this.jsonRepository.findOne({ where: { id: documentId, namespace: documentNamespace } });

    if (!document) {
      throw new HttpException('Document does not exist', HttpStatus.NOT_FOUND);
    }

    return await this.jsonRepository.delete({ id: documentId });
  }

  prepareResponse(status: HttpJsonStatus, list: JsonEntity[]): HttpJsonResult<JsonEntity> {
    return { status, items: list };
  }
}
