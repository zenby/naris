import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit'

@Injectable()
export class PDFService {
    create(dataCallback: (...args: any[]) => void, endCallback: (...args: any[]) => void) {
        const doc = new PDFDocument({bufferPages: true, font: 'Courier'})
        doc.on('data', dataCallback)
        doc.on('end', endCallback)
      
        doc.fontSize(20).text('A heading')
      
        doc
          .fontSize(12)
          .text('lorem10')
        doc.end()
    }
}