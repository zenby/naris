import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  Res,
  UseGuards,
  UsePipes,
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
import { UserService } from '../user/user.service';
import { BackendValidationPipe } from '../common/pipes/backend-validation.pipe';
import { error } from '@ant-design/icons-angular';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

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
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'Login',
    description: "Requires body { login, password }. Returns HTTP_ONLY cookie['refresh_token']",
  })
  @ApiCreatedResponse({ schema: responseSchema })
  async signIn(
    @Body() signInUserDto: SignInUserDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<HttpJsonResult<string>> {
    try {
      const user = await this.userService.findByLogin(signInUserDto);

      if (user instanceof Error) {
        return this.authService.generateError(user.message);
      }

      const isPasswordsMatch = await this.authService.compareUsersByPassword(signInUserDto, user);

      if (isPasswordsMatch instanceof Error) {
        return this.authService.generateError(isPasswordsMatch.message);
      }

      const token = await this.authService.getRefreshToken(user);

      const { cookieName } = this.configService.get<Configuration['jwt']>('jwt');
      response.cookie(cookieName, token, { httpOnly: true });

      return { status: HttpJsonStatus.Ok, items: [] };
    } catch (e) {
      this.logger.error(e);
      return this.authService.generateError(e.message);
    }
  }

  @Get('signout')
  @ApiOperation({ summary: 'Logout', description: 'The cookie with the refresh_token is destroyed' })
  @ApiOkResponse({ schema: responseSchema })
  async signOut(@Res({ passthrough: true }) response: Response): Promise<HttpJsonResult<never>> {
    const { cookieName } = this.configService.get<Configuration['jwt']>('jwt');

    response.clearCookie(cookieName);

    return { status: HttpJsonStatus.Ok, items: [] };
  }

  @Post('signup')
  @UsePipes(BackendValidationPipe)
  @ApiOperation({ summary: 'Registration' })
  @ApiCreatedResponse({ schema: responseSchema })
  async signUp(@Body() createUserDto: CreateUserDto): Promise<HttpJsonResult<string>> {
    try {
      const user = await this.userService.createUser(createUserDto);

      if (user instanceof Error) {
        return this.authService.generateError(user.message);
      }

      return { status: HttpJsonStatus.Ok, items: [] };
    } catch (e) {
      this.logger.error(e);

      if (typeof e === 'object' && !Object.keys(e).length) {
        throw new InternalServerErrorException('Something went wrong. Try it later');
      }

      const isHttpException = typeof e.status === 'number';

      if (isHttpException) {
        throw new HttpException(e.message, e.status);
      }

      throw new Error(e.message);
    }
  }
}
