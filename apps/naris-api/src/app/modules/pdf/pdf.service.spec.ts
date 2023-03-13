import { Test, TestingModule } from '@nestjs/testing';
import { PDFService } from './pdf.service';

describe('PDFService', () => {
  let service: PDFService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [PDFService],
    }).compile();

    service = module.get<PDFService>(PDFService);
  });

  afterEach(async () => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('PDFService.convert', () => {
    describe('Successful flow', () => {
      let result: Buffer;
      const content = '# Hello, World';

      beforeEach(async () => {
        result = await service.convert(content);
      });

      it('should return Buffer', () => {
        expect(Buffer.isBuffer(result)).toBeTruthy();
      });

      it('should return PDF in Buffer', () => {
        const documentHeader = result.toString('utf8', 0, 5);
        const isPDFHeader = documentHeader.includes('PDF');

        expect(isPDFHeader).toBeTruthy();
      });
    });
  });
});
