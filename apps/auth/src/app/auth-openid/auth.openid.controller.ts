import { Controller, Get, UseGuards, Logger, UsePipes, Res, InternalServerErrorException, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BackendValidationPipe } from '../common/pipes/backend-validation.pipe';
import { GoogleAuthGuard } from '../common/guards/google-auth.guard';
import { YandexAuthGuard } from '../common/guards/yandex-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user/user.entity';
import { Configuration } from '../config/config';
import { Response, Request } from 'express';
import { HttpJsonStatus } from '@soer/sr-common-interfaces';
import { AuthService } from '../auth/auth.service';
import { Fingerprint } from '../auth/helpers/fingerprint';

@ApiTags('auth')
@Controller('auth')
export class AuthOpenIdController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  logger = new Logger(AuthOpenIdController.name);
  internalErrorMessage = 'Something went wrong. Try it later';

  @Get('login/google')
  @UseGuards(GoogleAuthGuard)
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'Login in google',
    description: "Requires body { login, password }. Returns HTTP_ONLY cookie['refresh_token']",
  })
  async googleLogin() {
    return { status: HttpJsonStatus.Ok, items: [] as string[] };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'Callback when success authentication in google',
    description: "Requires body { login, password }. Returns HTTP_ONLY cookie['refresh_token']",
  })
  async googleLoginCallback(
    @User() user: UserEntity,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      const requestFingerprint = new Fingerprint(request);
      const refreshToken = this.authService.getRefreshToken(user, requestFingerprint);
      const { cookieName, redirectUrl } = this.configService.get<Configuration['jwt']>('jwt');
      // sameSite & secure  for firefox https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
      response.cookie(cookieName, refreshToken, { httpOnly: true, sameSite: 'none', secure: true });

      response.redirect(redirectUrl);
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
    return { status: HttpJsonStatus.Ok, items: [] as string[] };
  }

  @Get('yandex/callback')
  @UseGuards(YandexAuthGuard)
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'Callback when success authentication in yandex',
    description: "Requires user. Returns HTTP_ONLY cookie['refresh_token']",
  })
  async yandexCallback(
    @User() user: UserEntity,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      const requestFingerprint = new Fingerprint(request);
      const refreshToken = this.authService.getRefreshToken(user, requestFingerprint);

      const { cookieName, redirectUrl } = this.configService.get<Configuration['jwt']>('jwt');
      // sameSite & secure  for firefox https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
      response.cookie(cookieName, refreshToken, { httpOnly: true, sameSite: 'none', secure: true });

      response.redirect(redirectUrl);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(this.internalErrorMessage);
    }
  }
}
