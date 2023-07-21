import { ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

const logger = new Logger('Fingerprint');

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
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
