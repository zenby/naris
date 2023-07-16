import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Configuration, configurationFactory } from '../config/config';
import { ResourceModule } from './resource.module';
import { ResourceService } from './resource.service';
import { HttpJsonResult } from '@soer/sr-common-interfaces';
import { faker } from '@faker-js/faker';
import { DELIMETERS, ERRORS } from './constants';
import { rmSync } from 'fs';

describe('Resource (e2e)', () => {
  let app: INestApplication;
  let resourceService: ResourceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '../../.env',
          isGlobal: true,
          load: [configurationFactory],
        }),
        ResourceModule,
      ],
    }).compile();

    app = module.createNestApplication();
    resourceService = app.get(ResourceService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    const rootPath = app.get(ConfigService).get<Configuration['fileStoragePath']>('fileStoragePath');

    rmSync(rootPath, { recursive: true, force: true });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /resource', () => {
    it('should return 200 OK with data', async () => {
      const files = ['file1', 'file2'];

      jest.spyOn(resourceService, 'getFilenames').mockResolvedValue(files);

      const { body } = await request(app.getHttpServer()).get('/resource').expect(200);

      expect(body.items).toMatchObject(files.map((f) => ({ title: f })));
    });

    it('should return 200 OK with data filtered by filename', async () => {
      const files = [
        'barak3!barak2!2023-07-14-6d2oboet~barak1.jpg',
        'barak3!barak1!2023-07-14-7d2oboet~barak2.jpg', //
        'barak3!2023-07-14-8d2oboet~barak1.jpg',
        'barak2!2023-07-14-9d2oboet~barak2.jpg', //
        'barak1!2023-07-14-1d2oboet~barak3.jpg',
        '2023-07-14-2d2oboet~barak1.jpg',
        '2023-07-14-3d2oboet~barak2.jpg', //
      ];

      jest.spyOn(resourceService, 'getFilenames').mockResolvedValue(files);

      const { body } = await request(app.getHttpServer()).get('/resource?filename=barak2').expect(200);

      console.log(body.items);

      expect(body.items).toEqual([
        {
          title: 'barak3',
          children: [{ title: 'barak1', children: [{ title: '2023-07-14-7d2oboet~barak2.jpg' }] }],
        },
        { title: 'barak2', children: [{ title: '2023-07-14-9d2oboet~barak2.jpg' }] },
        { title: '2023-07-14-3d2oboet~barak2.jpg' },
      ]);
    });

    it('should return 200 OK with data filtered by folder', async () => {
      const files = [
        'barak3!barak2!2023-07-14-6d2oboet~barak1.jpg', //
        'barak3!barak1!2023-07-14-7d2oboet~barak2.jpg',
        'barak3!2023-07-14-8d2oboet~barak1.jpg',
        'barak2!2023-07-14-9d2oboet~barak2.jpg', //
        'barak1!2023-07-14-1d2oboet~barak3.jpg',
        '2023-07-14-2d2oboet~barak1.jpg',
        '2023-07-14-3d2oboet~barak2.jpg',
      ];

      jest.spyOn(resourceService, 'getFilenames').mockResolvedValue(files);

      const { body } = await request(app.getHttpServer()).get('/resource?folder=barak2').expect(200);

      expect(body.items).toEqual([
        {
          title: 'barak3',
          children: [{ title: 'barak2', children: [{ title: '2023-07-14-6d2oboet~barak1.jpg' }] }],
        },
        { title: 'barak2', children: [{ title: '2023-07-14-9d2oboet~barak2.jpg' }] },
      ]);
    });

    // it('should return 200 OK with data', async () => {
    //   const data = controller.getAllResources();
    //   expect(data).toBe(5);
    // });

    it.todo('should return 200 when search by folder name');
    it.todo('should return 200 when search by file name');
    it.todo('should return 200 when search by date');
    it.todo('should return 200 when search with * values');
  });

  describe('POST /resource', () => {
    it('should return error if has system symbols in path', async () => {
      const { path, fileMultipartData } = generateFileData({ pathFolders: [DELIMETERS.FOLDER + 'folder'] });

      const { body } = await request(app.getHttpServer())
        .post('/resource')
        .field('path', path)
        .attach('file', ...fileMultipartData)
        .expect(400);

      expect(body.message).toEqual([ERRORS.PATH_HAS_SYSTEM_SYMBOLS]);
    });

    it('should return error if has system symbols in original filename', async () => {
      const { fileMultipartData } = generateFileData({ name: 'filename' + DELIMETERS.NAME });

      const { body } = await request(app.getHttpServer())
        .post('/resource')
        .attach('file', ...fileMultipartData)
        .expect(400);

      expect(body.message).toBe(ERRORS.FILENAME_HAS_SYSTEM_SYMBOLS);
    });

    it('should return error if has invalid symbols in filename', async () => {
      const { path, fileMultipartData } = generateFileData({ pathFolders: ['smth smth'] });

      const { body } = await request(app.getHttpServer())
        .post('/resource')
        .field('path', path)
        .attach('file', ...fileMultipartData)
        .expect(400);

      expect(body.message).toBe(ERRORS.SHOULD_USE_VALID_SYMBOLS);
    });

    it('should return error if filename length is too long', async () => {
      const { path, fileMultipartData } = generateFileData({ pathFolders: [faker.lorem.word().repeat(200)] });

      const { body } = await request(app.getHttpServer())
        .post('/resource')
        .field('path', path)
        .attach('file', ...fileMultipartData)
        .expect(400);

      expect(body.message).toBe(ERRORS.FILENAME_IS_TOO_LONG);
    });

    it('should return 201 OK with uri when create file within folders', async () => {
      const fileData = generateFileData({});
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
      const fileData = generateFileData({ pathFolders: [] });

      const { body }: { body: HttpJsonResult<{ uri: string }> } = await request(app.getHttpServer())
        .post('/resource')
        .attach('file', ...fileData.fileMultipartData)
        .expect(201);

      const [{ uri }] = body.items;

      expectUriMatchFile(uri, fileData);
    });
  });
});

type FileData = {
  filename: string;
  folders: string[];
  path: string;
  fileMultipartData: [Buffer, Record<string, string>];
};

function generateFileData({
  pathFolders,
  name = faker.lorem.word(),
}: {
  pathFolders?: string[];
  name?: string;
}): FileData {
  const folders =
    pathFolders || Array.from({ length: faker.datatype.number({ min: 2, max: 5 }) }).map(() => faker.lorem.word());

  const filename = name + '.txt';

  return {
    folders,
    path: folders.join(DELIMETERS.PATH),
    filename,
    fileMultipartData: [
      Buffer.from(filename),
      {
        filename,
        contentType: 'text/plain',
      },
    ],
  };
}

function expectUriMatchFile(uri: string, file: FileData) {
  const { folders, filename } = file;

  // check folder in filename
  const foldersPart = folders.map((f) => f + `\\${DELIMETERS.FOLDER}`).join('');
  expect(uri).toStrictEqual(expect.stringMatching(new RegExp(`^/${foldersPart}`)));

  // check date in filename
  const [date] = new Date().toISOString().split('T');
  expect(uri.includes(date)).toBeTruthy();

  // check original filename
  expect(uri).toStrictEqual(expect.stringMatching(new RegExp(`(${DELIMETERS.NAME}${filename})$`)));
}
