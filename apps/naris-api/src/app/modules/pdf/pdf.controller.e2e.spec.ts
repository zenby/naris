import { PdfModule } from "./pdf.module";
import { INestApplication } from "@nestjs/common";
import * as supertest from "supertest";

import { Test } from '@nestjs/testing';

describe('PdfModule e2e-test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PdfModule],
    })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });
  it('/POST', () => {
    return supertest(app.getHttpServer())
      .post('document/convertor/MdToPdf')
      .expect(200)
  })

  afterAll(async () => {
    await app.close();
  });
});
