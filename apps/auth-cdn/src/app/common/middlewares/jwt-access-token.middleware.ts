import { BadGatewayException, ForbiddenException, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../config/config';

export enum Message {
  Forbidden = 'Access is denied',
  Gateway = 'Something went wrong, please try again later',
}

@Injectable()
export class JwtAccessTokenMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req?.headers?.authorization) {
      next(new ForbiddenException(Message.Forbidden));
      return;
    }

    const token = req.headers.authorization?.split(' ')?.[1];

    try {
      // checking the token in the auth project
      const isAccess = await this.isValidToken(token);

      if (isAccess) {
        next();
        return;
      } else {
        next(new ForbiddenException(Message.Forbidden));
        return;
      }
    } catch (e) {
      // if the error is in the verify method
      next(new BadGatewayException(Message.Gateway));
      return;
    }
  }

  async isValidToken(token: string): Promise<boolean> {
    try {
      const { jwtSecret: secret } = this.configService.get<Configuration['jwt']>('jwt');
      await this.jwtService.verifyAsync(token, { secret: secret });
      return true;
    } catch (e) {
      Logger.warn(e, 'Token validation');
      return false;
    }
  }
}
