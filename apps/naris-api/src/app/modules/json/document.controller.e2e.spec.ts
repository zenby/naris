import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { JsonModule } from './json.module';
import { HttpJsonStatus, UserManifest } from '@soer/sr-common-interfaces';
import { JwtConfig } from '../../config/jwt.config';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtTestHelper } from '../../common/tests/helpers/jwt.test.helper';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JsonEntity } from './json.entity';
import { createFakeDocument, jsonEntityMetadataPropertiesMap } from '../../common/tests/helpers/document.test.helper';
import { AccessTag } from './types/json.const';
import {
  ManifestGuestFixture,
  ManifestModule,
  ManifestProFixture,
  ManifestService,
  ManifestStreamFixture,
  ManifestUnknownFixture,
  ManifestWorkshopFixture,
} from '@soer/sr-auth-nest';
import { JsonService } from './json.service';

describe('JsonModule e2e-test', () => {
  let app: INestApplication;
  let request: supertest.SuperTest<supertest.Test>;
  let jsonRepositoryMock: Repository<JsonEntity>;
  let manifestServiceMock: ManifestService;
  let jsonService: JsonService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [JsonModule, ConfigModule.forFeature(JwtConfig), ManifestModule.forRoot({ apiUrl: '' })],
    })
      .overrideProvider(getRepositoryToken(JsonEntity))
      .useValue({
        save: jest.fn(),
        findOne: jest.fn(),
        count: jest.fn(),
        metadata: jsonEntityMetadataPropertiesMap,
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
    jsonService = moduleFixture.get<JsonService>(JsonService);
    jsonRepositoryMock = moduleFixture.get<Repository<JsonEntity>>(getRepositoryToken(JsonEntity));
    await app.init();

    request = supertest(app.getHttpServer());
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.spyOn(jsonService, 'isUserAuthorOfDocument').mockRestore();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('JSON document API', () => {
    it('should return document (for owner)', async () => {
      const document = createFakeDocument();
      const isAuthor = jest.spyOn(jsonService, 'isUserAuthorOfDocument');
      const findOne = jest.spyOn(jsonRepositoryMock, 'findOne');

      jest.spyOn(manifestServiceMock, 'resolve').mockReturnValueOnce(Promise.resolve(ManifestGuestFixture));
      isAuthor.mockReturnValueOnce(Promise.resolve(true));
      findOne.mockReturnValueOnce(Promise.resolve(document));

      await request
        .get(`/document/${document.id}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(isAuthor).toHaveBeenCalledWith(document.id, JwtTestHelper.defaultPayload.email);
      expect(findOne).toHaveBeenCalledWith({
        select: Object.keys(document).filter((key) => key !== 'author_email'),
        where: {
          id: document.id,
        },
      });
    });

    it('should return error for private document for regular users (not owner, any role)', async () => {
      const document = { ...createFakeDocument(), accessTag: 'PRIVATE' };
      const isAuthor = jest.spyOn(jsonService, 'isUserAuthorOfDocument');
      const findOne = jest.spyOn(jsonRepositoryMock, 'findOne');

      jest
        .spyOn(manifestServiceMock, 'resolve')
        .mockReturnValueOnce(
          Promise.resolve(
            faker.helpers.arrayElement([
              ManifestGuestFixture,
              ManifestStreamFixture,
              ManifestWorkshopFixture,
              ManifestProFixture,
              ManifestUnknownFixture,
            ])
          )
        );
      isAuthor.mockReturnValueOnce(Promise.resolve(false));
      findOne.mockReturnValueOnce(Promise.resolve(document));

      await request
        .get(`/document/${document.id}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Error, items: ['Необходим доступ не ниже PRIVATE'] });

      expect(findOne).toHaveBeenCalledWith({
        select: Object.keys(document).filter((key) => key !== 'author_email'),
        where: {
          id: document.id,
        },
      });
    });

    it('should return public document for regular users (not owner)', async () => {
      const document = { ...createFakeDocument(), accessTag: 'PUBLIC' };
      const isAuthor = jest.spyOn(jsonService, 'isUserAuthorOfDocument');
      const findOne = jest.spyOn(jsonRepositoryMock, 'findOne');

      jest
        .spyOn(manifestServiceMock, 'resolve')
        .mockReturnValueOnce(
          Promise.resolve(
            faker.helpers.arrayElement([
              ManifestGuestFixture,
              ManifestStreamFixture,
              ManifestWorkshopFixture,
              ManifestProFixture,
              ManifestUnknownFixture,
            ])
          )
        );
      isAuthor.mockReturnValueOnce(Promise.resolve(false));
      findOne.mockReturnValueOnce(Promise.resolve(document));

      await request
        .get(`/document/${document.id}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(findOne).toHaveBeenCalledWith({
        select: Object.keys(document).filter((key) => key !== 'author_email'),
        where: {
          id: document.id,
        },
      });
    });

    it('should return document with STREAM, WORKSHOP, PRO for regular users with same or greater role (not owner)', async () => {
      const accessTag = faker.helpers.arrayElement(['STREAM', 'WORKSHOP', 'PRO']);
      const validRolesVariants: { [key: string]: UserManifest[] } = {
        STREAM: [ManifestStreamFixture, ManifestWorkshopFixture, ManifestProFixture],
        WORKSHOP: [ManifestWorkshopFixture, ManifestProFixture],
        PRO: [ManifestProFixture],
      };

      const document = { ...createFakeDocument(), accessTag };
      const isAuthor = jest.spyOn(jsonService, 'isUserAuthorOfDocument');
      const findOne = jest.spyOn(jsonRepositoryMock, 'findOne');

      jest
        .spyOn(manifestServiceMock, 'resolve')
        .mockReturnValueOnce(Promise.resolve(faker.helpers.arrayElement(validRolesVariants[accessTag] || [])));
      isAuthor.mockReturnValueOnce(Promise.resolve(false));
      findOne.mockReturnValueOnce(Promise.resolve(document));

      await request
        .get(`/document/${document.id}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(findOne).toHaveBeenCalledWith({
        select: Object.keys(document).filter((key) => key !== 'author_email'),
        where: {
          id: document.id,
        },
      });
    });

    it('should return error for document with STREAM, WORKSHOP, PRO for regular users with lower role (not owner)', async () => {
      const accessTag = faker.helpers.arrayElement(['STREAM', 'WORKSHOP', 'PRO']);
      const validRolesVariants: { [key: string]: UserManifest[] } = {
        STREAM: [ManifestGuestFixture, ManifestUnknownFixture],
        WORKSHOP: [ManifestStreamFixture, ManifestGuestFixture, ManifestUnknownFixture],
        PRO: [ManifestStreamFixture, ManifestWorkshopFixture, ManifestGuestFixture, ManifestUnknownFixture],
      };

      const document = { ...createFakeDocument(), accessTag };
      const isAuthor = jest.spyOn(jsonService, 'isUserAuthorOfDocument');
      const findOne = jest.spyOn(jsonRepositoryMock, 'findOne');

      jest
        .spyOn(manifestServiceMock, 'resolve')
        .mockReturnValueOnce(Promise.resolve(faker.helpers.arrayElement(validRolesVariants[accessTag] || [])));
      isAuthor.mockReturnValueOnce(Promise.resolve(false));
      findOne.mockReturnValueOnce(Promise.resolve(document));

      await request
        .get(`/document/${document.id}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Error, items: ['Необходим доступ не ниже ' + accessTag] });

      expect(findOne).toHaveBeenCalledWith({
        select: Object.keys(document).filter((key) => key !== 'author_email'),
        where: {
          id: document.id,
        },
      });
    });

    it('should return public document for regular users (any role)', async () => {
      const document = { ...createFakeDocument(), accessTag: 'PUBLIC' };
      const isAuthor = jest.spyOn(jsonService, 'isUserAuthorOfDocument');
      const findOne = jest.spyOn(jsonRepositoryMock, 'findOne');

      jest
        .spyOn(manifestServiceMock, 'resolve')
        .mockReturnValueOnce(
          Promise.resolve(
            faker.helpers.arrayElement([
              ManifestGuestFixture,
              ManifestStreamFixture,
              ManifestWorkshopFixture,
              ManifestProFixture,
            ])
          )
        );
      isAuthor.mockReturnValueOnce(Promise.resolve(false));
      findOne.mockReturnValueOnce(Promise.resolve(document));

      await request
        .get(`/document/${document.id}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(findOne).toHaveBeenCalledWith({
        select: Object.keys(document).filter((key) => key !== 'author_email'),
        where: {
          id: document.id,
        },
      });
    });

    it('should patch properties of document (for owner)', async () => {
      const newAccessTag = AccessTag.STREAM;

      const document = {
        ...createFakeDocument(),
        author_email: JwtTestHelper.defaultPayload.email,
        accessTag: 'PRIVATE',
      };
      const { id } = document;
      const findOne = jest.spyOn(jsonRepositoryMock, 'findOne');
      const save = jest.spyOn(jsonRepositoryMock, 'save');
      const count = jest.spyOn(jsonRepositoryMock, 'count');

      findOne.mockReturnValueOnce(Promise.resolve(document));
      save.mockImplementationOnce((newDocument) => Promise.resolve(newDocument as JsonEntity));
      count.mockReturnValueOnce(Promise.resolve(1));

      await request
        .patch(`/document/${id}`)
        .set(JwtTestHelper.createBearerHeader())
        .send({ accessTag: newAccessTag })
        .expect({
          status: HttpJsonStatus.Ok,
          items: [{ ...document, accessTag: newAccessTag }],
        });

      expect(findOne).toHaveBeenCalledWith({
        select: Object.keys(document).filter((key) => key !== 'author_email'),
        where: { id },
      });
      expect(save).toHaveBeenCalledWith({ ...document, accessTag: newAccessTag });
    });
  });
});
