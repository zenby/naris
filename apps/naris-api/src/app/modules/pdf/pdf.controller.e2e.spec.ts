import { PdfModule } from "./pdf.module";
import {HttpStatus, INestApplication} from "@nestjs/common";
import * as supertest from "supertest";

import {Test, TestingModule} from '@nestjs/testing';
import {faker} from "@faker-js/faker";

describe('PdfModule e2e-test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
     imports: [PdfModule]
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /document/convertor/MdToPdf', () => {
    it('should return a response with buffer type', async () => {
      const pdfBuffer = createFakePDFBuffer();

      await supertest(app.getHttpServer())
        .post('/document/convertor/MdToPdf')
        .send({content: pdfBuffer.content})
        .expect(HttpStatus.OK)
        .responseType("Buffer")
    })
  })
});

function createFakePDFBuffer() {
  return {
    content: faker.lorem.word(),
  };
}
