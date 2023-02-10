import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import * as PdfConverter from 'md-to-pdf';
import { PdfController } from './pdf.controller';
import { PDFService } from './pdf.service';

describe('PdfController', () => {
  let pdfController: PdfController;
  let pdfService: PDFService;

  const requestMock = { content: 'pdfParams' };
  const responseMock = {
    write: jest.fn(),
    end: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfController],
      providers: [PDFService],
    }).compile();

    pdfController = module.get<PdfController>(PdfController);
    pdfService = module.get<PDFService>(PDFService);
  });

  it('should throw BadRequest exception on error', (done) => {
    jest.spyOn(pdfService, 'convert').mockImplementation(() => Promise.reject('PDF exception'));
    pdfController.getPdf(requestMock, responseMock).catch((error) => {
      expect(pdfService.convert).toBeCalledWith(requestMock.content);
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      done();
    });
  });

  it('should have pdfService for conversation md2pdf', async () => {
    const md2PdfMock = jest.spyOn(PdfConverter, 'mdToPdf');
    await pdfController.getPdf(requestMock, responseMock);
    expect(md2PdfMock).toBeCalledWith(requestMock);
  });

  it('should use return result via (res: Response).write', async () => {
    const pdfMock = Buffer.from([]);
    jest.spyOn(pdfService, 'convert').mockImplementation(async () => pdfMock);
    await pdfController.getPdf(requestMock, responseMock);

    expect(pdfService.convert).toBeCalledWith(requestMock.content);
    expect(responseMock.write).toBeCalledWith(pdfMock);
  });
});
