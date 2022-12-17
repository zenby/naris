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
    async getPdf(@Body() md: {Content: string}, @Res() res: Response) {
      res.setHeader('Content-Type', 'application/pdf');

      this.PDFService.create(md.Content, (pdf: Buffer) => {
        res.write(pdf)
        res.end()
      })
    }
}
