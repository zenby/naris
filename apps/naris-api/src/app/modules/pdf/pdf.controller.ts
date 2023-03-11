import { Body, Controller, Header, HttpCode, HttpException, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetPdfDto } from './dto/getPdf.dto';
import { PDFService } from './pdf.service';

@ApiTags('MdToPdf')
@Controller('document/convertor/MdToPdf')
export class PdfController {
  constructor(private readonly PDFService: PDFService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment')
  @HttpCode(200)
  @ApiOperation({ summary: 'Convert MD string to PDF file', description: 'Convert markdown string to pdf' })
  @ApiResponse({
    status: 200,
    description: 'Response contains the PDF file received from the passed content string.',
    type: Buffer,
  })
  async getPdf(@Body() md: GetPdfDto, @Res() res: Response) {
    try {
      const pdfBuffer = await this.PDFService.convert(md.content);
      res.write(pdfBuffer);
      res.end();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
