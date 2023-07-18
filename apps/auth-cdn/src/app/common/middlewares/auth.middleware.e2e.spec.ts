import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';

describe('JwtAccessTokenMiddleware (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 OK when token is valid', async () => {
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(undefined);
    await request(app.getHttpServer()).get('/').set('Authorization', 'Bearer valid_token').expect(200);
  });

  it('should return 403 Forbidden when authorization header is missing', async () => {
    await request(app.getHttpServer()).get('/').expect(403);
  });

  it('should return 403 Forbidden when token is invalid', async () => {
    jest.spyOn(jwtService, 'verifyAsync').mockImplementationOnce(() => {
      throw new Error();
    });
    await request(app.getHttpServer()).get('/').set('Authorization', 'Bearer invalid_token').expect(403);
  });
});
