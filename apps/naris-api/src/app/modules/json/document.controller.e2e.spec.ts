import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { JsonModule } from './json.module';
import { HttpJsonStatus, UserManifest } from '@soer/sr-common-interfaces';
import { JwtConfig } from '../../config/jwt.config';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtTestHelper } from '../../common/helpers/jwt.test.helper';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JsonEntity } from './json.entity';
import { createFakeDocument } from '../../common/helpers/document.test.helper';
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
import { faker } from '@faker-js/faker';

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
      const isAuthor = jest.spyOn(jsonService, 'isUserAuthorOfDocument');

      jest.spyOn(manifestServiceMock, 'resolve').mockReturnValueOnce(Promise.resolve(ManifestGuestFixture));
      isAuthor.mockReturnValueOnce(Promise.resolve(true));
      jsonRepositoryMock.findOne.mockReturnValueOnce(document);

      await request
        .get(`/document/${document.id}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Ok, items: [document] });

      expect(isAuthor).toHaveBeenCalledWith(document.id, JwtTestHelper.defaultPayload.email);
      expect(jsonRepositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          id: document.id,
        },
      });
    });

    it('should return error for private document for regular users (not owner, any role)', async () => {
      const document = { ...createFakeDocument(), accessTag: 'PRIVATE' };
      const isAuthor = jest.spyOn(jsonService, 'isUserAuthorOfDocument');

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
      jsonRepositoryMock.findOne.mockReturnValueOnce(document);

      await request
        .get(`/document/${document.id}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Error, items: ['Необходим доступ не ниже PRIVATE'] });

      expect(jsonRepositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          id: document.id,
        },
      });
    });

    it('should return public document for regular users (not owner)', async () => {
      const document = { ...createFakeDocument(), accessTag: 'PUBLIC' };
      const isAuthor = jest.spyOn(jsonService, 'isUserAuthorOfDocument');

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
      jsonRepositoryMock.findOne.mockReturnValueOnce(document);

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

    it('should return document with STREAM, WORKSHOP, PRO for regular users with same or greater role (not owner)', async () => {
      const accessTag = faker.helpers.arrayElement(['STREAM', 'WORKSHOP', 'PRO']);
      const validRolesVariants: { [key: string]: UserManifest[] } = {
        STREAM: [ManifestStreamFixture, ManifestWorkshopFixture, ManifestProFixture],
        WORKSHOP: [ManifestWorkshopFixture, ManifestProFixture],
        PRO: [ManifestProFixture],
      };

      const document = { ...createFakeDocument(), accessTag };
      const isAuthor = jest.spyOn(jsonService, 'isUserAuthorOfDocument');

      jest
        .spyOn(manifestServiceMock, 'resolve')
        .mockReturnValueOnce(Promise.resolve(faker.helpers.arrayElement(validRolesVariants[accessTag] || [])));
      isAuthor.mockReturnValueOnce(Promise.resolve(false));
      jsonRepositoryMock.findOne.mockReturnValueOnce(document);

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

    it('should return error for document with STREAM, WORKSHOP, PRO for regular users with lower role (not owner)', async () => {
      const accessTag = faker.helpers.arrayElement(['STREAM', 'WORKSHOP', 'PRO']);
      const validRolesVariants: { [key: string]: UserManifest[] } = {
        STREAM: [ManifestGuestFixture, ManifestUnknownFixture],
        WORKSHOP: [ManifestStreamFixture, ManifestGuestFixture, ManifestUnknownFixture],
        PRO: [ManifestStreamFixture, ManifestWorkshopFixture, ManifestGuestFixture, ManifestUnknownFixture],
      };

      const document = { ...createFakeDocument(), accessTag };
      const isAuthor = jest.spyOn(jsonService, 'isUserAuthorOfDocument');

      jest
        .spyOn(manifestServiceMock, 'resolve')
        .mockReturnValueOnce(Promise.resolve(faker.helpers.arrayElement(validRolesVariants[accessTag] || [])));
      isAuthor.mockReturnValueOnce(Promise.resolve(false));
      jsonRepositoryMock.findOne.mockReturnValueOnce(document);

      await request
        .get(`/document/${document.id}`)
        .set(JwtTestHelper.createBearerHeader())
        .expect({ status: HttpJsonStatus.Error, items: ['Необходим доступ не ниже ' + accessTag] });

      expect(jsonRepositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          id: document.id,
        },
      });
    });

    it('should return public document for regular users (any role)', async () => {
      const document = { ...createFakeDocument(), accessTag: 'PUBLIC' };
      const isAuthor = jest.spyOn(jsonService, 'isUserAuthorOfDocument');

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
      jsonRepositoryMock.findOne.mockReturnValueOnce(document);

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

      const document = {
        ...createFakeDocument(),
        author_email: JwtTestHelper.defaultPayload.email,
        accessTag: 'PRIVATE',
      };
      const { id } = document;

      jsonRepositoryMock.findOne.mockReturnValueOnce(document);
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
