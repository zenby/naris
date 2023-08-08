import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ManifestModule,
  ManifestProFixture,
  ManifestService,
  ManifestStreamFixture,
  ManifestWorkshopFixture,
} from '@soer/sr-auth-nest';
import { HttpJsonStatus } from '@soer/sr-common-interfaces';
import * as supertest from 'supertest';
import { In, Repository } from 'typeorm';
import { createFakeDocument } from '../../common/helpers/document.test.helper';
import { JwtTestHelper } from '../../common/helpers/jwt.test.helper';
import { JwtConfig } from '../../config/jwt.config';
import { JsonEntity } from './json.entity';
import { JsonModule } from './json.module';
import { AccessTag } from './types/json.const';

describe('JsonModule e2e-test', () => {
  let app: INestApplication;
  let request: supertest.SuperTest<supertest.Test>;
  let jsonRepositoryMock: Partial<Record<keyof Repository<JsonEntity>, jest.Mock>>;
  //  let manifestServiceMock: Partial<Record<keyof ManifestService, jest.Mock>>;
  let manifestServiceMock: ManifestService;

  beforeAll(async () => {
    jsonRepositoryMock = {
      find: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [JsonModule, ConfigModule.forFeature(JwtConfig), ManifestModule.forRoot({ apiUrl: '' })],
    })
      .overrideProvider(getRepositoryToken(ManifestService))
      .useValue(manifestServiceMock)
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
    manifestServiceMock = moduleFixture.get<ManifestService>(ManifestService);

    await app.init();

    request = supertest(app.getHttpServer());
  });

  afterEach(() => {
    jest.resetAllMocks();
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
    it('should find all documents with the STREAM tag when accessTag is passed as "STREAM"', async () => {
      const document = { ...createFakeDocument(), accessTag: AccessTag.STREAM };

      jsonRepositoryMock.find.mockReturnValueOnce([document]);
      manifestServiceMock.resolve = jest.fn().mockReturnValue(ManifestStreamFixture);

      await request
        .get(`/json/${document.namespace}/stream`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(jsonRepositoryMock.find).toHaveBeenCalledWith({
        select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
        where: { namespace: document.namespace, accessTag: In([AccessTag.STREAM]) },
      });
    });

    it('should find all documents with the WORKSHOP and STREAM tag when accessTag is passed as "WORKSHOP"', async () => {
      const document = { ...createFakeDocument(), accessTag: AccessTag.WORKSHOP };

      jsonRepositoryMock.find.mockReturnValueOnce([document]);
      manifestServiceMock.resolve = jest.fn().mockReturnValue(ManifestWorkshopFixture);

      await request
        .get(`/json/${document.namespace}/workshop`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(jsonRepositoryMock.find).toHaveBeenCalledWith({
        select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
        where: { namespace: document.namespace, accessTag: In([AccessTag.STREAM, AccessTag.WORKSHOP]) },
      });
    });

    it('should find all documents with the WORKSHOP, STREAM and PRO tag when accessTag is passed as "PRO"', async () => {
      const document = { ...createFakeDocument(), accessTag: AccessTag.PRO };

      jsonRepositoryMock.find.mockReturnValueOnce([document]);
      manifestServiceMock.resolve = jest.fn().mockReturnValue(ManifestProFixture);

      await request
        .get(`/json/${document.namespace}/pro`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(jsonRepositoryMock.find).toHaveBeenCalledWith({
        select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
        where: { namespace: document.namespace, accessTag: In([AccessTag.STREAM, AccessTag.WORKSHOP, AccessTag.PRO]) },
      });
    });

    it('should find all documents with the public tag when accessTag is passed as "public"', async () => {
      const document = { ...createFakeDocument(), accessTag: 'PUBLIC' };

      jsonRepositoryMock.find.mockReturnValueOnce([document]);

      await request
        .get(`/json/${document.namespace}/public`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(jsonRepositoryMock.find).toHaveBeenCalledWith({
        select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
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
        select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
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
        select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
        where: [conditionPublic, conditionPrivate],
      });
    });
  });

  describe('PUT /json/:documentNamespace/:documentId/:accessTag', () => {
    it('should change the accessTag of owned document ', async () => {
      const newAccessTag = AccessTag.STREAM;

      const document = { ...createFakeDocument(), author_email: JwtTestHelper.defaultPayload.email };
      const { id, namespace } = document;

      jsonRepositoryMock.findOne.mockReturnValueOnce({ ...document, accessTag: 'PRIVATE' });
      jsonRepositoryMock.save.mockImplementationOnce((newDocument) => Object.assign({}, newDocument));
      jsonRepositoryMock.count.mockReturnValueOnce(1);

      await request
        .put(`/json/${namespace}/${id}/accessTag`)
        .set(JwtTestHelper.createBearerHeader())
        .send({ accessTag: newAccessTag })
        .expect({
          status: HttpJsonStatus.Ok,
          items: [{ ...document, accessTag: newAccessTag }],
        });

      expect(jsonRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id, namespace },
      });
      expect(jsonRepositoryMock.save).toHaveBeenCalledWith({ ...document, accessTag: newAccessTag });
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
      jsonRepositoryMock.count.mockReturnValueOnce(1);

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
