import { Controller, Get, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from '../common/guards/jwt.guard';
import { HttpJsonResult } from '../common/interfaces/http-json-result.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Get access token',
    description: 'Requires cookie with token, returns JWT access token',
  })
  @ApiOkResponse()
  @ApiResponse({ status: HttpStatus.FORBIDDEN })
  @Get('/access_token')
  @UseGuards(JwtGuard)
  async getAccessToken(@Req() request: Request): Promise<HttpJsonResult<{ token: string }>> {
    const refreshToken: string = request.cookies['refresh_token'];

    try {
      const accessToken = await this.authService.getAccessToken(refreshToken);

      return { status: 'ok', items: [{ token: accessToken }] };
    } catch (e) {
      return { status: 'error', items: [] };
    }
  }
}
