import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { HttpJsonResult, HttpJsonStatus } from '../common/types/http-json-result.interface';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { Configuration } from '../config/config';
import { SignInUserDto } from '../user/dto/sign-in-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  logger = new Logger(AuthController.name);

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

  @Post('signin')
  @UsePipes(ValidationPipe)
  async signIn(
    @Body() signInUserDto: SignInUserDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<Required<Pick<HttpJsonResult<never>, 'status'>>> {
    try {
      const user = await this.authService.getComparedUser(signInUserDto);

      if (!user || user instanceof Error) {
        return { status: HttpJsonStatus.Error };
      }

      const token = await this.authService.getRefreshToken(user);

      if (!token) {
        return { status: HttpJsonStatus.Error };
      }

      const { cookieName } = this.configService.get<Configuration['jwt']>('jwt');
      response.cookie(cookieName, token, { httpOnly: true });

      return { status: HttpJsonStatus.Ok };
    } catch (e) {
      this.logger.error(e);
      return { status: HttpJsonStatus.Error };
    }
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.createUser(createUserDto);

      if (!user || user instanceof Error) {
        return { status: HttpJsonStatus.Error };
      }

      return { status: HttpJsonStatus.Ok };
    } catch (e) {
      this.logger.error(e);
      return { status: HttpJsonStatus.Ok };
    }
  }
}
