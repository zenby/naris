import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
// import { JwtService } from '@nestjs/jwt';
import { ResourceModule } from './resource.module';
import { INestApplication } from '@nestjs/common';

describe('JwtAccessTokenMiddleware (e2e)', () => {
  let app: INestApplication;
  // let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ResourceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    // jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /resources', () => {
    it('should return 200 OK with data', async () => {
      const { body } = await request(app.getHttpServer()).get('/resource').expect(200);

      expect(body.items.length).toBeGreaterThan(1);
    });
  });
});
