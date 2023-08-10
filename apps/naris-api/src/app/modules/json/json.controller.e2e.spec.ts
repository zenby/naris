import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { HttpJsonStatus } from '@soer/sr-common-interfaces';
import { JwtConfig } from '../../config/jwt.config';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtTestHelper } from '../../common/tests/helpers/jwt.test.helper';
import { In, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JsonEntity } from './json.entity';
import { createFakeDocument } from '../../common/tests/helpers/document.test.helper';
import { AccessTag } from './types/json.const';
import {
  ManifestModule,
  ManifestProFixture,
  ManifestService,
  ManifestStreamFixture,
  ManifestWorkshopFixture,
} from '@soer/sr-auth-nest';
import { JsonTestModule } from './tests/json.test.module';
import {
  testDocuments,
  defaultDocument,
  streamDocument,
  workshopDocument,
  proDocument,
  publicDocument,
  privateDocument,
} from './tests/json.test.documents';
import { JsonController } from './json.controller';

describe('JsonModule e2e-test', () => {
  let app: INestApplication;
  let request: supertest.SuperTest<supertest.Test>;
  let manifestServiceMock: ManifestService;
  let jsonRepo: Repository<JsonEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [JsonTestModule, ConfigModule.forFeature(JwtConfig), ManifestModule.forRoot({ apiUrl: '' })],
      controllers: [JsonController],
    })
      .overrideProvider(getRepositoryToken(ManifestService))
      .useValue(manifestServiceMock)
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
    jsonRepo = app.get<Repository<JsonEntity>>(getRepositoryToken(JsonEntity));

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
      const docsWithNamespace = testDocuments.filter((x) => x.namespace === defaultDocument.namespace);
      const findSpy = jest.spyOn(jsonRepo, 'find');

      await request
        .get(`/json/${defaultDocument.namespace}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [...docsWithNamespace] });

      expect(findSpy).toHaveBeenCalledWith({ where: { namespace: defaultDocument.namespace } });
    });
  });

  describe('GET /json/:documentNamespace/:accessTag', () => {
    it('should find all documents with the STREAM tag when accessTag is passed as "STREAM"', async () => {
      manifestServiceMock.resolve = jest.fn().mockReturnValue(ManifestStreamFixture);
      const findSpy = jest.spyOn(jsonRepo, 'find');

      await request
        .get(`/json/${streamDocument.namespace}/stream`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [streamDocument] });

      expect(findSpy).toHaveBeenCalledWith({
        select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
        where: { namespace: streamDocument.namespace, accessTag: In([AccessTag.STREAM]) },
      });
    });

    it('should find all documents with the WORKSHOP and STREAM tag when accessTag is passed as WORKSHOP', async () => {
      manifestServiceMock.resolve = jest.fn().mockReturnValue(ManifestWorkshopFixture);
      const findSpy = jest.spyOn(jsonRepo, 'find');

      await request
        .get(`/json/${workshopDocument.namespace}/workshop`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [streamDocument, workshopDocument] });

      expect(findSpy).toHaveBeenCalledWith({
        select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
        where: { namespace: workshopDocument.namespace, accessTag: In([AccessTag.STREAM, AccessTag.WORKSHOP]) },
      });
    });

    it('should find all documents with the WORKSHOP, STREAM and PRO tag when accessTag is passed as "PRO"', async () => {
      manifestServiceMock.resolve = jest.fn().mockReturnValue(ManifestProFixture);
      const findSpy = jest.spyOn(jsonRepo, 'find');

      await request
        .get(`/json/${proDocument.namespace}/pro`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [streamDocument, workshopDocument, proDocument] });

      expect(findSpy).toHaveBeenCalledWith({
        select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
        where: {
          namespace: proDocument.namespace,
          accessTag: In([AccessTag.STREAM, AccessTag.WORKSHOP, AccessTag.PRO]),
        },
      });
    });

    it('should find all documents with the public tag when accessTag is passed as "public"', async () => {
      const publicDocs = testDocuments.filter((x) => x.accessTag === AccessTag.PUBLIC);
      const findSpy = jest.spyOn(jsonRepo, 'find');

      await request
        .get(`/json/${publicDocument.namespace}/public`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [...publicDocs] });

      expect(findSpy).toHaveBeenCalledWith({
        select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
        where: { namespace: publicDocument.namespace, accessTag: 'PUBLIC' },
      });
    });

    it('should find all documents of the current user', async () => {
      const usersDocs = testDocuments.filter((x) => x.author_email === defaultDocument.author_email);
      const findSpy = jest.spyOn(jsonRepo, 'find');

      await request
        .get(`/json/${defaultDocument.namespace}/private`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [...usersDocs] });

      expect(findSpy).toHaveBeenCalledWith({
        select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
        where: { namespace: defaultDocument.namespace, author_email: defaultDocument.author_email },
      });
    });

    it('should find all documents from the namespace with both private and public access when accessTag is passed as all', async () => {
      const conditionPublic = { namespace: privateDocument.namespace, accessTag: 'PUBLIC' };
      const conditionPrivate = { namespace: privateDocument.namespace, accessTag: 'PRIVATE' };

      const publicAndPrivateDocs = [
        ...testDocuments.filter((x) => x.accessTag === AccessTag.PUBLIC),
        ...testDocuments.filter((x) => x.accessTag === AccessTag.PRIVATE),
      ];
      const findSpy = jest.spyOn(jsonRepo, 'find');

      await request
        .get(`/json/${privateDocument.namespace}/all`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [...publicAndPrivateDocs] });

      expect(findSpy).toHaveBeenCalledWith({
        select: ['accessTag', 'createdAt', 'id', 'json', 'namespace'],
        where: [conditionPublic, conditionPrivate],
      });
    });
  });

  describe('PUT /json/:documentNamespace/:documentId/:accessTag', () => {
    it('should change the accessTag of owned document ', async () => {
      const newAccessTag = AccessTag.STREAM;
      const document = Object.assign({}, defaultDocument);
      const { id, namespace } = document;

      const findOneSpy = jest.spyOn(jsonRepo, 'findOne');
      const saveSpy = jest.spyOn(jsonRepo, 'save');

      await request
        .put(`/json/${namespace}/${id}/accessTag`)
        .set(JwtTestHelper.createBearerHeader())
        .send({ accessTag: newAccessTag })
        .expect({
          status: HttpJsonStatus.Ok,
          items: [{ ...document, accessTag: newAccessTag }],
        });

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id, namespace },
      });
      expect(saveSpy).toHaveBeenCalledWith({ ...document, accessTag: newAccessTag });
    });
  });

  describe('POST /json/:documentNamespace/new', () => {
    it('should create json when passing valid json dto', async () => {
      const document = createFakeDocument();
      const saveSpy = jest.spyOn(jsonRepo, 'save');
      const savedFields = {
        author_email: JwtTestHelper.defaultPayload.email,
        namespace: document.namespace,
        json: document.json,
      };

      const response = await request
        .post(`/json/${document.namespace}/new`)
        .set(JwtTestHelper.createBearerHeader())
        .send({ json: document.json });

      const body = response.body;

      expect(body).toEqual({
        status: HttpJsonStatus.Ok,
        items: [expect.objectContaining(savedFields)],
      });

      expect(saveSpy).toHaveBeenCalledWith(savedFields);
    });
  });

  describe('GET /json/:documentNamespace/:documentId', () => {
    it('should find document when the document is in the repository', async () => {
      const findOneSpy = jest.spyOn(jsonRepo, 'findOne');

      await request
        .get(`/json/${defaultDocument.namespace}/${defaultDocument.id}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [defaultDocument] });

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: defaultDocument.id, namespace: defaultDocument.namespace },
      });
    });
  });

  describe('PUT /json/:documentNamespace/:documentId', () => {
    it('should update document when pass stored document id', async () => {
      const { id, namespace } = defaultDocument;
      const jsonToUpdate = faker.lorem.text();

      const updatedDocument = { ...defaultDocument, json: jsonToUpdate };

      const findOneSpy = jest.spyOn(jsonRepo, 'findOne');
      const saveSpy = jest.spyOn(jsonRepo, 'save');

      await request
        .put(`/json/${namespace}/${id}`)
        .set(JwtTestHelper.createBearerHeader())
        .send({ json: jsonToUpdate })
        .expect({ status: HttpJsonStatus.Ok, items: [updatedDocument] });

      expect(findOneSpy).toHaveBeenCalledWith({ where: { id, namespace } });
      expect(saveSpy).toHaveBeenCalledWith(updatedDocument);
    });
  });

  describe('DELETE /json/:documentNamespace/:documentId', () => {
    it('should delete document when pass stored document id', async () => {
      const { id, namespace } = defaultDocument;

      const findOneSpy = jest.spyOn(jsonRepo, 'findOne');
      const deleteSpy = jest.spyOn(jsonRepo, 'delete');

      await request
        .delete(`/json/${namespace}/${id}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [] });

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id, namespace },
      });
      expect(deleteSpy).toHaveBeenCalledWith({ id });
    });
  });
});
