import { Injectable } from '@nestjs/common';
import { mdToPdf } from 'md-to-pdf';

@Injectable()
export class PDFService {
  async convert(content: string): Promise<Buffer> {
    const pdf = await mdToPdf({ content });
    return pdf.content;
  }
}
