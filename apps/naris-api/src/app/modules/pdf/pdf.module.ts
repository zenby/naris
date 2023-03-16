import { Module } from '@nestjs/common';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { PdfController } from './pdf.controller';
import { PDFService } from './pdf.service';

@Module({
  providers: [PDFService, JwtStrategy],
  controllers: [PdfController],
})
export class PdfModule {}
