import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Configuration, configurationFactory } from '../config/config';
import { HttpJsonResult } from '@soer/sr-common-interfaces';
import { faker } from '@faker-js/faker';
import { DELIMETERS, ERRORS } from './constants';
import { rmSync } from 'fs';
import { generateTestFileData } from './helpers/generate-filedata.helper';
import { FileData } from './resource.model';
import { TestResourceModule } from './tests/resource.test.module';
import { ResourceRepository } from './resource.repository';

describe('Resource (e2e)', () => {
  let app: INestApplication;
  let resourceRepository: ResourceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '../../../.env',
          isGlobal: true,
          load: [configurationFactory],
        }),
        TestResourceModule,
      ],
    }).compile();

    app = module.createNestApplication();
    resourceRepository = app.get(ResourceRepository);
    await app.init();
  });

  afterAll(async () => {
    await app.close();

    const rootPath = app.get(ConfigService).get<Configuration['fileStoragePath']>('fileStoragePath');

    rmSync(rootPath, { recursive: true, force: true });
  });

  describe('GET /resource', () => {
    it('should return 200 OK with data', async () => {
      const files = [
        'barak3!barak2!2023-07-14-6d2oboet~barak1.jpg',
        'barak3!2023-07-14-8d2oboet~barak1.jpg',
        '2023-07-14-2d2oboet~barak1.jpg',
      ];

      jest.spyOn(resourceRepository, 'getFilenames').mockResolvedValue(files);

      const { body } = await request(app.getHttpServer()).get('/resource').expect(200);

      expect(body.items).toEqual([
        {
          title: 'barak3',
          children: [
            {
              title: 'barak2',
              children: [{ title: 'barak1.jpg', url: buildURL(files[0]) }],
            },
            { title: 'barak1.jpg', url: buildURL(files[1]) },
          ],
        },
        { title: 'barak1.jpg', url: buildURL(files[2]) },
      ]);
    });

    describe('should return results when filter', () => {
      const files = [
        'phantom3!fantom2!2023-07-14-6d2oboet~fantom1.jpg',
        'fantom3!pantom1!2023-07-14-7d2oboet~fantom2.jpg',
        'phantom3!2023-07-14-8d2oboet~fantom1.jpg',
        'fantom2!2023-07-14-9d2oboet~fantom2.jpg',
        'dantom1!2023-07-14-1d2oboet~fantom3.jpg',
        '2023-07-14-2d2oboet~fantom1.jpg',
        '2023-07-14-3d2oboet~fantom2.jpg',
        '2023-07-14-1d2oboet~mumbarak.jpg',
        '2023-07-14-2d2oboet~barak.jpg',
        '2023-07-14-3d2oboet~baragur.jpg',
      ];

      beforeAll(() => {
        jest.spyOn(resourceRepository, 'getFilenames').mockResolvedValue(files);
      });

      it('by full folder name', async () => {
        const { body } = await request(app.getHttpServer()).get('/resource?folder=fantom2').expect(200);

        expect(body.items).toEqual([
          {
            title: 'phantom3',
            children: [
              {
                title: 'fantom2',
                children: [{ title: 'fantom1.jpg', url: buildURL(files[0]) }],
              },
            ],
          },
          {
            title: 'fantom2',
            children: [{ title: 'fantom2.jpg', url: buildURL(files[3]) }],
          },
        ]);
      });

      it('by folder name with pattern fantom*', async () => {
        const { body } = await request(app.getHttpServer()).get('/resource?folder=dantom*').expect(200);

        expect(body.items).toEqual([
          { title: 'dantom1', children: [{ title: 'fantom3.jpg', url: buildURL(files[4]) }] },
        ]);
      });

      it('by folder name with pattern *antom2', async () => {
        const { body } = await request(app.getHttpServer()).get('/resource?folder=*antom2').expect(200);

        expect(body.items).toEqual([
          {
            title: 'phantom3',
            children: [{ title: 'fantom2', children: [{ title: 'fantom1.jpg', url: buildURL(files[0]) }] }],
          },
          { title: 'fantom2', children: [{ title: 'fantom2.jpg', url: buildURL(files[3]) }] },
        ]);
      });

      it('by folder name with pattern *hantom*', async () => {
        const { body } = await request(app.getHttpServer()).get('/resource?folder=*hantom*').expect(200);

        expect(body.items).toEqual([
          {
            title: 'phantom3',
            children: [
              { title: 'fantom2', children: [{ title: 'fantom1.jpg', url: buildURL(files[0]) }] },
              { title: 'fantom1.jpg', url: buildURL(files[2]) },
            ],
          },
        ]);
      });

      it('by full filename', async () => {
        const { body } = await request(app.getHttpServer()).get('/resource?filename=fantom2').expect(200);

        expect(body.items).toEqual([
          {
            title: 'fantom3',
            children: [{ title: 'pantom1', children: [{ title: 'fantom2.jpg', url: buildURL(files[1]) }] }],
          },
          { title: 'fantom2', children: [{ title: 'fantom2.jpg', url: buildURL(files[3]) }] },
          { title: 'fantom2.jpg', url: buildURL(files[6]) },
        ]);
      });

      it('by filename with pattern bar*', async () => {
        const { body } = await request(app.getHttpServer()).get('/resource?filename=bar*').expect(200);

        expect(body.items).toEqual([
          { title: 'barak.jpg', url: buildURL(files[8]) },
          { title: 'baragur.jpg', url: buildURL(files[9]) },
        ]);
      });

      it('by filename with pattern *bar*', async () => {
        const { body } = await request(app.getHttpServer()).get('/resource?filename=*bar*').expect(200);

        expect(body.items).toEqual([{ title: 'mumbarak.jpg', url: buildURL(files[7]) }]);
      });

      it('by filename with pattern *barak', async () => {
        const { body } = await request(app.getHttpServer()).get('/resource?filename=*barak').expect(200);

        expect(body.items).toEqual([{ title: 'mumbarak.jpg', url: buildURL(files[7]) }]);
      });
    });
  });

  describe('POST /resource', () => {
    it('should return error if has system symbols in path', async () => {
      const { path, fileMultipartData } = generateTestFileData({
        pathFolders: ['smth' + DELIMETERS.FOLDER + DELIMETERS.SEARCH_ANY_CHAR + 'folder'],
      });

      const { body } = await request(app.getHttpServer())
        .post('/resource')
        .field('path', path)
        .attach('file', ...fileMultipartData)
        .expect(400);

      expect(body.message).toEqual(ERRORS.PATH_HAS_SYSTEM_SYMBOLS);
    });

    it('should return error if has system symbols in original filename', async () => {
      const filename = 'smth' + DELIMETERS.NAME + DELIMETERS.SEARCH_ANY_CHAR + 'smth';
      const { fileMultipartData } = generateTestFileData({ name: filename });

      const { body } = await request(app.getHttpServer())
        .post('/resource')
        .attach('file', ...fileMultipartData)
        .expect(400);

      expect(body.message).toBe(ERRORS.FILENAME_HAS_SYSTEM_SYMBOLS);
    });

    it('should return error if has invalid symbols in filename', async () => {
      const { path, fileMultipartData } = generateTestFileData({ pathFolders: ['smth smth'] });

      const { body } = await request(app.getHttpServer())
        .post('/resource')
        .field('path', path)
        .attach('file', ...fileMultipartData)
        .expect(400);

      expect(body.message).toBe(ERRORS.SHOULD_USE_VALID_SYMBOLS);
    });

    it('should return error if filename length is too long', async () => {
      const { path, fileMultipartData } = generateTestFileData({ pathFolders: [faker.lorem.word().repeat(200)] });

      const { body } = await request(app.getHttpServer())
        .post('/resource')
        .field('path', path)
        .attach('file', ...fileMultipartData)
        .expect(400);

      expect(body.message).toBe(ERRORS.FILENAME_IS_TOO_LONG);
    });

    it('should return 201 OK with uri when create file within folders', async () => {
      const fileData = generateTestFileData({});
      const { path, fileMultipartData } = fileData;

      const { body }: { body: HttpJsonResult<{ uri: string }> } = await request(app.getHttpServer())
        .post('/resource')
        .field('path', path)
        .attach('file', ...fileMultipartData)
        .expect(201);

      const [{ uri }] = body.items;

      expectUriMatchFile(uri, fileData);
    });

    it('should return 201 OK with uri when create file without folders', async () => {
      const fileData = generateTestFileData({ pathFolders: [] });

      const { body }: { body: HttpJsonResult<{ uri: string }> } = await request(app.getHttpServer())
        .post('/resource')
        .attach('file', ...fileData.fileMultipartData)
        .expect(201);

      const [{ uri }] = body.items;

      expectUriMatchFile(uri, fileData);
    });
  });

  function getFileUrlPrefix() {
    const host = app.get(ConfigService).get<Configuration['host']>('host');
    const route = app.get(ConfigService).get<Configuration['serveUploadsRoute']>('serveUploadsRoute');
    return `${host}/${route}`;
  }

  function buildURL(filename: string) {
    return `${getFileUrlPrefix()}/${filename}`;
  }

  function expectUriMatchFile(uri: string, { folders, filename }: FileData) {
    // starts with host and uploads route
    expect(uri).toStrictEqual(expect.stringMatching(new RegExp(`^${getFileUrlPrefix()}`)));

    // check folder in filename
    const foldersPart = folders.map((f) => f + `\\${DELIMETERS.FOLDER}`).join('');
    expect(uri).toStrictEqual(expect.stringMatching(new RegExp(`/${foldersPart}`)));

    // check date in filename
    const [date] = new Date().toISOString().split('T');
    expect(uri.includes(date)).toBeTruthy();

    // check original filename
    expect(uri).toStrictEqual(expect.stringMatching(new RegExp(`(${DELIMETERS.NAME}${filename})$`)));
  }
});
