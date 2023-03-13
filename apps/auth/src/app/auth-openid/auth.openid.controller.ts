import { Controller, Get, UseGuards, Logger, UsePipes, Res, InternalServerErrorException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BackendValidationPipe } from '../common/pipes/backend-validation.pipe';
import { GoogleAuthGuard } from '../common/guards/google-auth.guard';
import { YandexAuthGuard } from '../common/guards/yandex-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user/user.entity';
import { Configuration } from '../config/config';
import { Response } from 'express';
import { HttpJsonStatus } from '@soer/sr-common-interfaces';
import { AuthOpenIdService } from './auth.openid.service';

@ApiTags('auth')
@Controller('auth')
export class AuthOpenIdController {
  constructor(private readonly authService: AuthOpenIdService, private readonly configService: ConfigService) {}

  logger = new Logger(AuthOpenIdController.name);
  internalErrorMessage = 'Something went wrong. Try it later';

  @Get('login/google')
  @UseGuards(GoogleAuthGuard)
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'Login in google',
    description: "Requires body { login, password }. Returns HTTP_ONLY cookie['refresh_token']",
  })
  googleLogin() {
    return { status: HttpJsonStatus.Ok, items: [] };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'Callback when success authentication in google',
    description: "Requires body { login, password }. Returns HTTP_ONLY cookie['refresh_token']",
  })
  async googleLoginCallback(@User() user: UserEntity, @Res({ passthrough: true }) response: Response) {
    try {
      const refreshToken = await this.authService.getRefreshToken(user);

      const { cookieName } = this.configService.get<Configuration['jwt']>('jwt');
      response.cookie(cookieName, refreshToken, { httpOnly: true });

      return { status: HttpJsonStatus.Ok, items: [] };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException(this.internalErrorMessage);
    }
  }

  @Get('login/yandex')
  @UseGuards(YandexAuthGuard)
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'Login in yandex',
    description: 'Requires user. Redirects to yandex',
  })
  async yandexLogin() {
    return { status: HttpJsonStatus.Ok, items: [] };
  }

  @Get('yandex/callback')
  @UseGuards(YandexAuthGuard)
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'Callback when success authentication in yandex',
    description: "Requires user. Returns HTTP_ONLY cookie['refresh_token']",
  })
  async yandexCallback(@User() user: UserEntity, @Res({ passthrough: true }) response: Response) {
    try {
      const refreshToken = await this.authService.getRefreshToken(user);
      const { cookieName } = this.configService.get<Configuration['jwt']>('jwt');
      // sameSite & secure  for firefox https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
      response.cookie(cookieName, refreshToken, { httpOnly: true, sameSite: 'none', secure: true });
      return { status: HttpJsonStatus.Ok, items: [] };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(this.internalErrorMessage);
    }
  }
}
