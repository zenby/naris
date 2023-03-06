import { PdfModule } from './pdf.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

describe('PdfModule e2e-test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PdfModule],
    }).compile();

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
        .expect(HttpStatus.OK)
        .expect('Content-Type', 'application/pdf');
    });
  });
});
