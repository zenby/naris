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
    const requestMock = { content: 'pdfParams' };
    const responseMock = {} as unknown as Response;

    jest.spyOn(pdfService, 'convert').mockImplementation(() => Promise.reject('PDF exception'));
    pdfController.getPdf(requestMock, responseMock).catch((error) => {
      expect(pdfService.convert).toBeCalledWith(requestMock.content);
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      done();
    });
  });

  it('should return pdf success', async () => {
    const pdfMock = Buffer.from([]);
    const requestMock = { content: 'pdfParams' };
    const responseMock = {
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as Response;

    jest.spyOn(pdfService, 'convert').mockImplementation(async () => pdfMock);
    await pdfController.getPdf(requestMock, responseMock);

    expect(pdfService.convert).toBeCalledWith(requestMock.content);
    expect(responseMock.write).toBeCalledWith(pdfMock);
  });
});
