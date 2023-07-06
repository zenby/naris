import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
// import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';

describe('JwtAccessTokenMiddleware (e2e)', () => {
  let app: INestApplication;
  // let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

  describe('GET /resource', () => {
    it('should return 200 OK with data', async () => {
      const { body } = await request(app.getHttpServer()).get('/resource').expect(200);

      console.log(body);

      expect(body.items.length).toBeGreaterThan(1);
    });
  });

  describe('GET /resource/:resourceId', () => {});

  describe('POST /resource/', () => {});
});
