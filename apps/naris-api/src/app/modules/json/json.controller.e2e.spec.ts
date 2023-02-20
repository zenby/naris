import { JsonModule } from './json.module';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';

import { Test } from '@nestjs/testing';
import { HttpJsonStatus } from '../../common/types/http-json-response.interface';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';

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

describe('JsonModule e2e-test', () => {
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
    it('should find all documents when pass without concrete document id', async () => {
      const document = createFakeDocument();

      jsonRepositoryMock.find.mockReturnValueOnce([document]);

      await request.get(`/json/${document.group}`).expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(jsonRepositoryMock.find).toHaveBeenCalledWith({ where: { group: document.group } });
    });
  });

  describe('POST /json/:documentGroup/new', () => {
    it('should create json when passing valid json dto', async () => {
      const document = createFakeDocument();

      jsonRepositoryMock.save.mockReturnValueOnce(document);

      await request
        .post(`/json/${document.group}/new`)
        .send({ json: document.json })
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(jsonRepositoryMock.save).toHaveBeenCalledWith({ group: document.group, json: document.json });
    });
  });

  describe('GET /json/:documentGroup/:documentId', () => {
    it('should find document when the document is in the repository', async () => {
      const document = createFakeDocument();

      jsonRepositoryMock.findOne.mockReturnValueOnce(document);

      await request
        .get(`/json/${document.group}/${document.id}`)
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(jsonRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: document.id, group: document.group } });
    });
  });

  describe('PUT /json/:documentGroup/:documentId', () => {
    it('should update document when pass stored document id', async () => {
      const documentId = faker.datatype.number();
      const documentGroup = faker.lorem.word();
      const jsonToUpdate = faker.lorem.text();

      let storedDocument = createFakeDocument();
      storedDocument.id = documentId;
      storedDocument.group = documentGroup;

      // Воспроизводим ожидаемое поведение репозитория для добавления надежности тесту.
      jsonRepositoryMock.findOne.mockReturnValueOnce(storedDocument);
      jsonRepositoryMock.save.mockImplementationOnce((newDocument) => (storedDocument = newDocument));

      await request
        .put(`/json/${documentGroup}/${documentId}`)
        .send({ json: jsonToUpdate })
        .expect({ status: HttpJsonStatus.Ok, items: [storedDocument] });

      expect(storedDocument.json).toBe(jsonToUpdate);
      expect(jsonRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: documentId, group: documentGroup } });
      expect(jsonRepositoryMock.save).toHaveBeenCalledWith({ ...storedDocument, json: jsonToUpdate });
    });
  });

  describe('DELETE /json/:documentGroup/:documentId', () => {
    it('should delete document when pass stored document id', async () => {
      const storedDocument = createFakeDocument();

      jsonRepositoryMock.findOne.mockReturnValueOnce(storedDocument);

      await request
        .delete(`/json/${storedDocument.group}/${storedDocument.id}`)
        .expect({ status: HttpJsonStatus.Ok, items: [] });

      expect(jsonRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: storedDocument.id, group: storedDocument.group },
      });
      expect(jsonRepositoryMock.delete).toHaveBeenCalledWith({ id: storedDocument.id });
    });
  });
});

function createFakeDocument() {
  return {
    id: faker.datatype.number(),
    json: faker.lorem.text(),
    group: faker.lorem.word(),
  };
}
