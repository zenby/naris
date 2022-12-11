import { Injectable } from '@nestjs/common';
import {mdToPdf} from 'md-to-pdf'

@Injectable()
export class PDFService {
    async create(content: string, dataCallback: (arg: Buffer) => void) {
       const pdf = await mdToPdf({content})
       dataCallback(pdf.content)
    }
}