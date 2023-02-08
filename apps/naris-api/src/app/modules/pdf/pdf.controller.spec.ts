import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PdfController } from './pdf.controller';
import { PDFService } from './pdf.service';

describe('PdfController', () => {
  let pdfController: PdfController;
  let pdfService: PDFService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfController],
      providers: [PDFService],
    }).compile();

    pdfController = module.get<PdfController>(PdfController);
    pdfService = module.get<PDFService>(PDFService);
  });

  it('should be defined pfdController', () => {
    expect(pdfController).toBeDefined();
  });

  it('should return exception', (done) => {
    const requestMock = { content: 'pdf' };
    const responseMock = {
      status: jest.fn().mockImplementation().mockReturnValue(HttpStatus.OK),
      write: jest.fn().mockImplementation(),
      end: jest.fn((x) => x),
    } as unknown as Response;

    jest.spyOn(pdfService, 'convert').mockImplementation(() => Promise.reject('PDF exception'));
    pdfController.getPdf(requestMock, responseMock).catch((error) => {
      expect(error).toBeInstanceOf(HttpException);
      done();
    });
  });

  it('should return pdf success', async () => {
    const mockPdf = Buffer.from([]);
    const requestMock = { content: 'pdf' };
    const responseMock = {
      status: jest.fn().mockImplementation().mockReturnValue(HttpStatus.OK),
      write: jest.fn().mockImplementation().mockReturnValue(mockPdf),
      end: jest.fn((x) => x),
    } as unknown as Response;

    jest.spyOn(pdfService, 'convert').mockImplementation(async () => mockPdf);
    expect(await pdfController.getPdf(requestMock, responseMock)).toEqual(responseMock.end());
  });
});
