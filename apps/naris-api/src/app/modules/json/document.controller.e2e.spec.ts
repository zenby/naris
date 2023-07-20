import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { JsonModule } from './json.module';
import { HttpJsonStatus, ManifestNamespace } from '@soer/sr-common-interfaces';
import { JwtConfig } from '../../config/jwt.config';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtTestHelper } from '../../common/helpers/jwt.test.helper';
import { In, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JsonEntity } from './json.entity';
import { createFakeDocument } from '../../common/helpers/document.test.helper';
import { AccessTag } from './types/json.const';
import {
  ManifestModule,
  ManifestProFixture,
  ManifestService,
  ManifestStreamFixture,
  ManifestWorkshopFixture,
} from '@soer/sr-auth-nest';
import { JsonService } from './json.service';

describe('JsonModule e2e-test', () => {
  let app: INestApplication;
  let request: supertest.SuperTest<supertest.Test>;
  let jsonRepositoryMock: Partial<Record<keyof Repository<JsonEntity>, jest.Mock>>;
  let manifestServiceMock: ManifestService;
  let jsonService: JsonService;

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
    jsonService = moduleFixture.get<JsonService>(JsonService);
    await app.init();

    request = supertest(app.getHttpServer());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('JSON document API', () => {
    it('should return document (for owner)', async () => {
      const document = createFakeDocument();
      const isOwnerMock = jest.spyOn(jsonService, 'isUserAuthorOfDocument');

      jsonRepositoryMock.findOne.mockReturnValueOnce(document);
      isOwnerMock.mockReturnValueOnce(Promise.resolve(true));

      await request
        .get(`/document/${document.id}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(jsonRepositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          id: document.id,
        },
      });
    });

    it('should patch properties of document (for owner)', async () => {
      const newAccessTag = AccessTag.STREAM;

      const document = { ...createFakeDocument(), author_email: JwtTestHelper.defaultPayload.email };
      const { id } = document;

      jsonRepositoryMock.findOne.mockReturnValueOnce({ ...document, accessTag: 'PRIVATE' });
      jsonRepositoryMock.save.mockImplementationOnce((newDocument) => Object.assign({}, newDocument));
      jsonRepositoryMock.count.mockReturnValueOnce(1);

      await request
        .patch(`/document/${id}`)
        .set(JwtTestHelper.createBearerHeader())
        .send({ accessTag: newAccessTag })
        .expect({
          status: HttpJsonStatus.Ok,
          items: [{ ...document, accessTag: newAccessTag }],
        });

      expect(jsonRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(jsonRepositoryMock.save).toHaveBeenCalledWith({ ...document, accessTag: newAccessTag });
    });
  });
});
