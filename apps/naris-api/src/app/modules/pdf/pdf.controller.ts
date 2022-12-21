import { Body, Controller, Header, HttpCode, Post, Res } from '@nestjs/common';
import {Response} from 'express'
import { PDFService } from './pdf.service'
@Controller('creator/pdf')
export class PdfController {
    constructor(private readonly PDFService: PDFService){

    }
    @Post() 
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment')
    @HttpCode(200)
    async getPdf(@Body() md: {content: string}, @Res() res: Response) {
      const pdfBuffer = await this.PDFService.convert(md.content);
      res.write(pdfBuffer)
      res.end()
    }
}
