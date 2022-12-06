import { Controller, Get, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { HttpJsonResult, HttpJsonStatus } from '../common/types/http-json-result.interface';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @ApiOperation({
    summary: 'Get access token',
    description: 'Requires cookie with token, returns JWT access token',
  })
  @ApiOkResponse()
  @ApiResponse({ status: HttpStatus.FORBIDDEN })
  @Get('/access_token')
  @UseGuards(JwtAuthGuard)
  async getAccessToken(@User() user: UserEntity): Promise<HttpJsonResult<{ token: string }>> {
    try {
      const accessToken = await this.authService.getAccessToken(user);

      return { status: HttpJsonStatus.Ok, items: [{ token: accessToken }] };
    } catch (e) {
      return { status: HttpJsonStatus.Error, items: [] };
    }
  }
}
