import { JsonModule } from './json.module';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';

import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JsonEntity } from './json.entity';
import { HttpJsonStatus } from '../../common/types/http-json-response.interface';
import { DataSource } from 'typeorm';

const jsonRepositoryMock = {
  find: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

// https://gitlog.ru/Naris/soermono/issues/164
const dataSourceMockHack = {
  entityMetadatas: {
    find: jest.fn(),
  },
  options: {
    type: jest.fn(),
  },
  getRepository: () => jsonRepositoryMock,
};

describe('Auth e2e-test', () => {
  let app: INestApplication;
  let request: ReturnType<typeof supertest>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JsonModule],
    })
      .useMocker((token) => {
        if (token == DataSource) return dataSourceMockHack;
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    request = supertest(app.getHttpServer());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /json/:documentGroup/', () => {
    it('should find all documents when pass without concrete document id', () => {
      const documentGroup = 'test-document-group';
      const document = {};

      jest
        .spyOn(jsonRepositoryMock, 'find')
        .mockImplementationOnce((options) => (options.where.group == documentGroup ? [document] : []));

      return request.get(`/json/${documentGroup}`).expect({ status: HttpJsonStatus.Ok, items: [document] });
    });
  });

  describe('POST /json/:documentGroup/new', () => {
    it('should create json when passing valid json dto', () => {
      const jsonString =
        '{"title":"Разобраться с документацией .http","overview":"Я впервые сталкиваюсь с подобным форматом и хотел бы его изучить. ","progress":0,"tasks":[]}';
      const document = {};

      jest.spyOn(jsonRepositoryMock, 'save').mockImplementationOnce(() => document);

      return request
        .post('/json/test-document-group/new')
        .send({ jsonString })
        .expect({ status: HttpJsonStatus.Ok, items: [document] });
    });

    describe('GET /json/:documentGroup/:documentId', () => {
      it('should find document when the document is in the repository', () => {
        const documentId = '123';
        const documentGroup = 'test-document-group';
        const document = {};

        jest.spyOn(jsonRepositoryMock, 'findOne').mockImplementationOnce((options) => {
          if (options.where.id == documentId && options.where.group == documentGroup) return document;
        });

        return request
          .get(`/json/${documentGroup}/${documentId}`)
          .expect({ status: HttpJsonStatus.Ok, items: [document] });
      });
    });

    describe('PUT /json/:documentGroup/:documentId', () => {
      it('should update document when pass stored document id', () => {
        const documentId = '123';
        const documentGroup = 'test-document-group';
        const jsonToUpdate = '{"title":"Это обновленный документ .http"}';

        let storedDocument = { json: '{"title":"Это старый документ .http"}' };
        jest.spyOn(jsonRepositoryMock, 'findOne').mockImplementationOnce((options) => {
          if (options.where.id == documentId && options.where.group == documentGroup) return storedDocument;
        });

        jest.spyOn(jsonRepositoryMock, 'save').mockImplementationOnce((newDocument) => (storedDocument = newDocument));

        return request
          .put(`/json/${documentGroup}/${documentId}`)
          .send({ json: jsonToUpdate })
          .expect({ status: HttpJsonStatus.Ok, items: [storedDocument] })
          .then(() => {
            expect(storedDocument.json).toBe(jsonToUpdate);
          });
      });
    });

    describe('DELETE /json/:documentGroup/:documentId', () => {
      it('should delete document when pass stored document id', () => {
        const documentId = '123';
        const documentGroup = 'test-document-group';

        let storedDocument = { json: '{"title":"Документ .http"}' };
        jest.spyOn(jsonRepositoryMock, 'findOne').mockImplementationOnce((options) => {
          if (options.where.id == documentId && options.where.group == documentGroup) return storedDocument;
        });
        jest.spyOn(jsonRepositoryMock, 'delete').mockImplementationOnce((options) => {
          if (options.id == documentId) storedDocument = null;
        });

        return request
          .delete(`/json/${documentGroup}/${documentId}`)
          .expect({ status: HttpJsonStatus.Ok, items: [] })
          .then(() => {
            expect(storedDocument).toBeNull();
          });
      });
    });
  });
});
