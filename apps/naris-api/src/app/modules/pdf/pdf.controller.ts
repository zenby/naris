import { Body, Controller, Header, Post, Res } from '@nestjs/common';
import {Response} from 'express'
import { PDFService } from './pdf.service'
@Controller('pdf')
export class PdfController {
    constructor(private readonly PDFService: PDFService){

    }
    @Post() 
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment')
    async getPdf(@Body() md: {Content: string}, @Res() res: Response) {
      this.PDFService.create(md.Content, (pdf: Buffer) => {
        res.write(pdf)
        res.end()
      })
    }
}
