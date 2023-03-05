import { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { Configuration } from '../config/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { responseSchema } from './doc/response.schema';
import { accessTokenSchema } from './doc/access_token.schema';
import { BackendValidationPipe } from '../common/pipes/backend-validation.pipe';
import { responseErrorSchema } from './doc/response-error.schema';
import { ValidationErrorHelper } from '../common/helpers/validation-error.helper';
import { User } from '../common/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { RefreshCookieGuard } from '../common/guards/refreshCookie.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  logger = new Logger(AuthController.name);
  internalErrorMessage = 'Something went wrong. Try it later';

  @ApiOperation({
    summary: 'Get access token',
    description: 'Requires cookie with token, returns JWT access token',
  })
  @ApiOkResponse({ schema: accessTokenSchema })
  @ApiUnauthorizedResponse({
    description: 'Invalid or empty refresh token',
  })
  @UseGuards(RefreshCookieGuard)
  @Get('access_token')
  async getAccessToken(@User() user: UserEntity): Promise<HttpJsonResult<{ accessToken: string }>> {
    try {
      const accessToken = await this.authService.getAccessToken(user);

      return { status: HttpJsonStatus.Ok, items: [{ accessToken }] };
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;

      this.logger.error(e);

      throw new InternalServerErrorException(this.internalErrorMessage);
    }
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'Login',
    description: "Requires body { login, password }. Returns HTTP_ONLY cookie['refresh_token']",
  })
  @ApiCreatedResponse({ schema: responseSchema })
  @ApiNotFoundResponse({ schema: responseErrorSchema('User with login ... not found') })
  @ApiUnauthorizedResponse({ schema: responseErrorSchema('Invalid password') })
  async signIn(
    @User() user: UserEntity | Error,
    @Res({ passthrough: true }) response: Response
  ): Promise<HttpJsonResult<string>> {
    try {
      const refreshToken = await this.authService.getRefreshToken(user);

      if (refreshToken instanceof Error) {
        return { status: HttpJsonStatus.Error, items: [refreshToken.message] };
      }

      const { cookieName } = this.configService.get<Configuration['jwt']>('jwt');
      response.cookie(cookieName, refreshToken, { httpOnly: true });

      return { status: HttpJsonStatus.Ok, items: [] };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException(this.internalErrorMessage);
    }
  }

  @Get('signout')
  @ApiOperation({ summary: 'Logout', description: 'The cookie with the refresh_token is destroyed' })
  @ApiOkResponse({ schema: responseSchema })
  async signOut(@Res({ passthrough: true }) response: Response): Promise<HttpJsonResult<never>> {
    try {
      const { cookieName } = this.configService.get<Configuration['jwt']>('jwt');

      response.clearCookie(cookieName);

      return { status: HttpJsonStatus.Ok, items: [] };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException(this.internalErrorMessage);
    }
  }

  @Post('signup')
  @UsePipes(BackendValidationPipe)
  @ApiOperation({ summary: 'Registration' })
  @ApiCreatedResponse({ schema: responseSchema })
  @ApiUnprocessableEntityResponse({ schema: responseErrorSchema('Email or login has already been taken') })
  @ApiInternalServerErrorResponse({ schema: responseErrorSchema('Something went wrong. Try it later') })
  async signUp(@Body() createUserDto: CreateUserDto): Promise<HttpJsonResult<string>> {
    try {
      const user = await this.authService.signUp(createUserDto);

      if (user instanceof Error) {
        if (user.message.includes(';')) {
          return { status: HttpJsonStatus.Error, items: ValidationErrorHelper.stringToArray(user.message) };
        }

        return { status: HttpJsonStatus.Error, items: [user.message] };
      }

      return { status: HttpJsonStatus.Ok, items: [] };
    } catch (e) {
      this.logger.error(e);

      const isHttpException = typeof e.status === 'number';

      if (isHttpException) {
        throw new HttpException(e.message, e.status);
      }

      throw new InternalServerErrorException(this.internalErrorMessage);
    }
  }
}
