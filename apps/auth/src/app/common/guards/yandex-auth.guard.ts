import { ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

const logger = new Logger('Yandex oauth');

@Injectable()
export class YandexAuthGuard extends AuthGuard('yandex') {
  async canActivate(context: ExecutionContext) {
    const activate = (await super.canActivate(context)) as boolean;
    return activate;
  }

  handleRequest<UserEntity>(err: Error, user: UserEntity) {
    if (err || !user) {
      logger.error(err);
      logger.error(JSON.stringify(user));
      throw err || new ForbiddenException();
    }
    return user;
  }
}
