import { Body, Controller, Header, HttpCode, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import {Response} from 'express'
import { PDFService } from './pdf.service'
@Controller('document/convertor/MdToPdf')
export class PdfController {
    constructor(private readonly PDFService: PDFService){

    }
    @Post() 
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment')
    @HttpCode(200)
    async getPdf(@Body() md: {content: string}, @Res() res: Response) {
      try {
        const pdfBuffer = await this.PDFService.convert(md.content);
        res.write(pdfBuffer)
        res.end()
      } catch (e) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
      }
    }
}
