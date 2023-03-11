import { PdfModule } from './pdf.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { ConfigType } from '@nestjs/config';
import { JwtTestHelper } from '../../common/helpers/JwtTestHelper';
import { JwtConfig } from '../../config/jwt.config';

describe('PdfModule e2e-test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PdfModule],
    })
      .useMocker((token) => {
        if (token == JwtConfig.KEY) {
          const jwtConfigMock: ConfigType<typeof JwtConfig> = { jwtSecret: JwtTestHelper.defaultSecret };
          return jwtConfigMock;
        }
      })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /document/convertor/MdToPdf', () => {
    it('should return the PDF file received from the passed content string', async () => {
      await supertest(app.getHttpServer())
        .post('/document/convertor/MdToPdf')
        .send({ content: faker.lorem.word() })
        .set(JwtTestHelper.createBearerHeader())
        .expect(HttpStatus.OK)
        .expect('Content-Type', 'application/pdf');
    });
  });
});
