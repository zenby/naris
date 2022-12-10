import { Controller, Get, HttpException, HttpStatus, Logger, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get(':filename')
  async sendFile(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
    const path = this.appService.getFilePath(filename);

    try {
      await this.appService.isExistFile(path);

      res.sendFile(path);
    } catch (e) {
      Logger.warn(e);

      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }
}
