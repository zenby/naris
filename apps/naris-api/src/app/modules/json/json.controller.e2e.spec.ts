import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { JsonModule } from './json.module';
import { HttpJsonStatus } from '@soer/sr-common-interfaces';
import { JwtConfig } from '../../config/jwt.config';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtTestHelper } from '../../common/helpers/JwtTestHelper';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JsonEntity } from './json.entity';

describe('JsonModule e2e-test', () => {
  let app: INestApplication;
  let request: supertest.SuperTest<supertest.Test>;
  let jsonRepositoryMock: Partial<Record<keyof Repository<JsonEntity>, jest.Mock>>;

  beforeAll(async () => {
    jsonRepositoryMock = {
      find: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [JsonModule, ConfigModule.forFeature(JwtConfig)],
    })
      .overrideProvider(getRepositoryToken(JsonEntity))
      .useValue(jsonRepositoryMock)
      .useMocker((token) => {
        if (token == JwtConfig.KEY) {
          const jwtConfigMock: ConfigType<typeof JwtConfig> = {
            jwtSecret: JwtTestHelper.defaultSecret,
          };
          return jwtConfigMock;
        }
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    request = supertest(app.getHttpServer());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /json/:documentNamespace/', () => {
    it('should find all documents when pass without concrete document id', async () => {
      const document = createFakeDocument();
      jsonRepositoryMock.find.mockReturnValueOnce([document]);

      await request
        .get(`/json/${document.namespace}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(jsonRepositoryMock.find).toHaveBeenCalledWith({ where: { namespace: document.namespace } });
    });
  });

  describe('GET /json/:documentNamespace/:accessTag', () => {
    it('should find all documents with the public tag when accessTag is passed as "public"', async () => {
      const document = { ...createFakeDocument(), accessTag: 'PUBLIC' };

      jsonRepositoryMock.find.mockReturnValueOnce([document]);

      await request
        .get(`/json/${document.namespace}/public`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(jsonRepositoryMock.find).toHaveBeenCalledWith({
        where: { namespace: document.namespace, accessTag: 'PUBLIC' },
      });
    });

    it('should find all documents of the current user when accessTag is passed as "private', async () => {
      const document = { ...createFakeDocument(), author_email: JwtTestHelper.defaultPayload.email };

      jsonRepositoryMock.find.mockReturnValueOnce([document]);

      await request
        .get(`/json/${document.namespace}/private`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(jsonRepositoryMock.find).toHaveBeenCalledWith({
        where: { namespace: document.namespace, author_email: JwtTestHelper.defaultPayload.email },
      });
    });

    it('should find all documents from the namespace with both private and public access when accessTag is passed as "all"', async () => {
      const namespace = faker.lorem.word();
      const publicDocument = { ...createFakeDocument(), namespace: namespace, accessTag: 'PUBLIC' };
      const privateDocument = { ...createFakeDocument(), namespace: namespace, accessTag: 'PRIVATE' };
      const conditionPublic = { namespace: namespace, accessTag: 'PUBLIC' };
      const conditionPrivate = { namespace: namespace, accessTag: 'PRIVATE' };

      jsonRepositoryMock.find.mockReturnValueOnce([publicDocument, privateDocument]);

      await request
        .get(`/json/${namespace}/all`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [publicDocument, privateDocument] });

      expect(jsonRepositoryMock.find).toHaveBeenCalledWith({
        where: [conditionPublic, conditionPrivate],
      });
    });
  });

  describe('PUT /json/:documentNamespace/:documentId/:accessTag', () => {
    it('should change the value of accessTag to public for private document', async () => {
      const document = { ...createFakeDocument(), author_email: JwtTestHelper.defaultPayload.email };
      const { id, namespace } = document;

      jsonRepositoryMock.findOne.mockReturnValueOnce({ ...document, accessTag: 'PRIVATE' });
      jsonRepositoryMock.save.mockImplementationOnce((newDocument) => Object.assign({}, newDocument));

      await request
        .put(`/json/${namespace}/${id}/accessTag`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({
          status: HttpJsonStatus.Ok,
          items: [{ ...document, accessTag: 'PUBLIC' }],
        });

      expect(jsonRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id, namespace, author_email: JwtTestHelper.defaultPayload.email },
      });
      expect(jsonRepositoryMock.save).toHaveBeenCalledWith({ ...document, accessTag: 'PUBLIC' });
    });
  });

  describe('POST /json/:documentNamespace/new', () => {
    it('should create json when passing valid json dto', async () => {
      const document = createFakeDocument();

      jsonRepositoryMock.save.mockReturnValueOnce(document);

      await request
        .post(`/json/${document.namespace}/new`)
        .set(JwtTestHelper.createBearerHeader())
        .send({ json: document.json })
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(jsonRepositoryMock.save).toHaveBeenCalledWith({
        author_email: JwtTestHelper.defaultPayload.email,
        namespace: document.namespace,
        json: document.json,
      });
    });
  });

  describe('GET /json/:documentNamespace/:documentId', () => {
    it('should find document when the document is in the repository', async () => {
      const document = createFakeDocument();

      jsonRepositoryMock.findOne.mockReturnValueOnce(document);

      await request
        .get(`/json/${document.namespace}/${document.id}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(jsonRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: document.id, namespace: document.namespace },
      });
    });
  });

  describe('PUT /json/:documentNamespace/:documentId', () => {
    it('should update document when pass stored document id', async () => {
      const documentToUpdate = createFakeDocument();
      const { id, namespace } = documentToUpdate;
      const jsonToUpdate = faker.lorem.text();

      const updatedDocument = { ...documentToUpdate, json: jsonToUpdate };

      jsonRepositoryMock.findOne.mockReturnValueOnce(documentToUpdate);
      jsonRepositoryMock.save.mockImplementationOnce((newDocument) => Object.assign({}, newDocument));
      jsonRepositoryMock.count.mockReturnValueOnce(1);

      await request
        .put(`/json/${namespace}/${id}`)
        .set(JwtTestHelper.createBearerHeader())
        .send({ json: jsonToUpdate })
        .expect({ status: HttpJsonStatus.Ok, items: [updatedDocument] });

      expect(jsonRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id, namespace } });
      expect(jsonRepositoryMock.save).toHaveBeenCalledWith(updatedDocument);
    });
  });

  describe('DELETE /json/:documentNamespace/:documentId', () => {
    it('should delete document when pass stored document id', async () => {
      const storedDocument = createFakeDocument();

      jsonRepositoryMock.findOne.mockReturnValueOnce(storedDocument);
      jsonRepositoryMock.count.mockReturnValueOnce(1);

      await request
        .delete(`/json/${storedDocument.namespace}/${storedDocument.id}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [] });

      expect(jsonRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: storedDocument.id, namespace: storedDocument.namespace },
      });
      expect(jsonRepositoryMock.delete).toHaveBeenCalledWith({ id: storedDocument.id });
    });
  });
});

function createFakeDocument() {
  return {
    id: faker.datatype.number(),
    json: faker.lorem.text(),
    author_email: faker.internet.email(),
    namespace: faker.lorem.word(),
    accessTag: faker.helpers.arrayElement(['PUBLIC', 'PRIVATE']),
  };
}
