import { Controller, Get, Header, Res } from '@nestjs/common';
import {Response} from 'express'
import { PDFService } from './pdf.service'

@Controller('pdf')
export class PdfController {
    constructor(private readonly PDFService: PDFService){

    }
    @Get() 
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment')
    getPdf(@Res() res: Response) {
      const stream = res.writeHead(200, {})
      this.PDFService.create((chunk) => stream.write(chunk), () => stream.end())
    }
}
