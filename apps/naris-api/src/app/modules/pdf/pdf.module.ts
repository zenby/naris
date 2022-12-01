import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PDFService } from './pdf.service';

@Module({
  providers: [PDFService],
  controllers: [PdfController]
})
export class PdfModule {}
