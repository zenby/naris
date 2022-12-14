import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { HttpJsonResult, HttpJsonStatus } from '../common/types/http-json-result.interface';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { Configuration } from '../config/config';
import { SignInUserDto } from '../user/dto/sign-in-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { responseSchema } from './doc/response.schema';
import { accessTokenSchema } from './doc/access_token.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  logger = new Logger(AuthController.name);

  @Get('/access_token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get access token',
    description: 'Requires cookie with token, returns JWT access token',
  })
  @ApiOkResponse({ schema: accessTokenSchema })
  @ApiResponse({ status: HttpStatus.FORBIDDEN })
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
  @ApiOperation({
    summary: 'Login',
    description: "Requires body { login, password }. Returns HTTP_ONLY cookie['refresh_token']",
  })
  @ApiCreatedResponse({ schema: responseSchema })
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

  @Get('signout')
  @ApiOperation({ summary: 'Logout', description: 'The cookie with the refresh_token is destroyed' })
  @ApiOkResponse({ schema: responseSchema })
  async signOut(@Res({ passthrough: true }) response: Response) {
    const { cookieName } = this.configService.get<Configuration['jwt']>('jwt');

    response.clearCookie(cookieName);

    return { status: HttpJsonStatus.Ok };
  }

  @Post('signup')
  @ApiOperation({ summary: 'Registration' })
  @ApiCreatedResponse({ schema: responseSchema })
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
