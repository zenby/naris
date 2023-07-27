import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonEntity } from './json.entity';
import { DeleteResult, In, Repository } from 'typeorm';
import { CreateJsonDto } from './dto/create-json.dto';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { UpdateJsonDto } from './dto/update-json.dto';
import { AccessTag } from './types/json.const';
import { PatchDocumentPropertiesDto } from './dto/patch-document-properties.dto';

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

  async findDocumentsWithAccessTag(documentNamespace: string, tags: AccessTag[]): Promise<JsonEntity[]> {
    return await this.jsonRepository.find({
      select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
      where: {
        namespace: documentNamespace,
        accessTag: In(tags),
      },
    });
  }

  async findPublicDocuments(documentNamespace: string): Promise<JsonEntity[]> {
    return await this.jsonRepository.find({
      select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
      where: {
        namespace: documentNamespace,
        accessTag: 'PUBLIC',
      },
    });
  }

  async findCurrentUserDocuments(documentNamespace: string, author_email: string): Promise<JsonEntity[]> {
    return await this.jsonRepository.find({
      select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
      where: {
        namespace: documentNamespace,
        author_email: author_email,
      },
    });
  }

  async findPrivateAndPublicDocuments(documentNamespace: string): Promise<JsonEntity[]> {
    const conditionPublic = {
      namespace: documentNamespace,
      accessTag: 'PUBLIC',
    };
    const conditionPrivate = {
      namespace: documentNamespace,
      accessTag: 'PRIVATE',
    };

    return await this.jsonRepository.find({
      select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
      where: [conditionPublic, conditionPrivate],
    });
  }

  async switchAccessTag(
    documentId: number,
    documentNamespace: string,
    author_email: string
  ): Promise<JsonEntity | Error> {
    const document = await this.jsonRepository.findOne({
      where: {
        id: documentId,
        namespace: documentNamespace,
        author_email: author_email,
      },
    });

    if (!document) {
      return new NotFoundException(`Document ${documentId} for author ${author_email} does not exist`);
    }

    document.accessTag = document.accessTag === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';

    return await this.jsonRepository.save(document);
  }

  async findDocumentById(documentId: number): Promise<JsonEntity> {
    return await this.jsonRepository.findOne({
      where: {
        id: documentId,
      },
    });
  }

  async findOne(documentNamespace: string, documentId: number): Promise<JsonEntity> {
    return await this.jsonRepository.findOne({
      where: {
        id: documentId,
        namespace: documentNamespace,
      },
    });
  }

  async patchDocument(documentId: number, newProperties: PatchDocumentPropertiesDto): Promise<JsonEntity | Error> {
    const document = await this.findDocumentById(documentId);

    if (!document) {
      return new NotFoundException(`Document ${documentId} does not exist`);
    }

    Object.assign(document, newProperties);

    return await this.jsonRepository.save(document);
  }

  async updateAccessTag(
    documentId: number,
    documentNamespace: string,
    accessTag: AccessTag
  ): Promise<JsonEntity | Error> {
    const document = await this.jsonRepository.findOne({
      where: {
        id: documentId,
        namespace: documentNamespace,
      },
    });

    if (!document) {
      return new NotFoundException(`Document ${documentId} does not exist`);
    }

    Object.assign(document, { accessTag });

    return await this.jsonRepository.save(document);
  }

  async update(
    documentId: number,
    documentNamespace: string,
    updateJsonDto: UpdateJsonDto
  ): Promise<JsonEntity | Error> {
    const document = await this.jsonRepository.findOne({
      where: {
        id: documentId,
        namespace: documentNamespace,
      },
    });

    if (!document) {
      return new NotFoundException(`Document ${documentId} does not exist`);
    }

    Object.assign(document, updateJsonDto);

    return await this.jsonRepository.save(document);
  }

  async delete(documentId: number, documentNamespace: string): Promise<DeleteResult | Error> {
    const document = await this.jsonRepository.findOne({
      where: {
        id: documentId,
        namespace: documentNamespace,
      },
    });

    if (!document) {
      return new NotFoundException(`Document ${documentId} does not exist`);
    }

    return await this.jsonRepository.delete({ id: documentId });
  }

  async isUserAuthorOfDocument(documentId: number, authorEmail: string): Promise<boolean> {
    const count = await this.jsonRepository.count({
      where: {
        author_email: authorEmail,
        id: documentId,
      },
    });

    return count > 0;
  }

  accessTagGuard(userAccessTag: AccessTag, documentAccessTag: AccessTag): boolean {
    const levels = [AccessTag.PUBLIC, AccessTag.STREAM, AccessTag.WORKSHOP, AccessTag.PRO, AccessTag.PRIVATE];

    const userLevel = levels.indexOf(userAccessTag);
    const docLevel = levels.indexOf(documentAccessTag);

    return docLevel !== -1 && docLevel <= userLevel;
  }
  prepareResponse(status: HttpJsonStatus, list: JsonEntity[]): HttpJsonResult<JsonEntity> {
    return {
      status,
      items: list,
    };
  }
}
