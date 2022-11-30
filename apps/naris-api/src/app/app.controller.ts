import { Controller, Get, Res, Header } from '@nestjs/common';
import {Response} from 'express'
import { AppService } from './app.service';
import * as PDFDocument from 'pdfkit'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="package.pdf"')
  getPdf(@Res() res: Response) {
    const stream = res.writeHead(200, {})
    buildPDF((chunk) => stream.write(chunk), () => stream.end())
  }


}
function buildPDF(dataCallback, endCallback) {
  const doc = new PDFDocument({bufferPages: true, font: 'Courier'})
  doc.on('data', dataCallback)
  doc.on('end', endCallback)
  doc.fontSize(20).text('A heading')

  doc
    .fontSize(12)
    .text('lorem10')
  doc.end()
}