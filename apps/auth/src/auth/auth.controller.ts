import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../common/guards/jwt.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/access_token')
  @UseGuards(JwtGuard)
  async getAccessToken(@Req() request: Request) {
    const refreshToken: string = request.cookies['token'];

    return this.authService.getAccessToken(refreshToken);
  }
}
