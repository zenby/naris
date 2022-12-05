import { Controller, Get, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Get access token',
    description: 'Requires cookie with token, returns JWT access token',
  })
  @ApiOkResponse()
  @ApiResponse({ status: HttpStatus.FORBIDDEN })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR })
  @Get('/access_token')
  @UseGuards(JwtGuard)
  async getAccessToken(@Req() request: Request) {
    const refreshToken: string = request.cookies['token'];

    return this.authService.getAccessToken(refreshToken);
  }
}
