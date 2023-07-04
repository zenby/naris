import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { BadGatewayException, ForbiddenException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../config/config';

export enum ErrorMessage {
  Forbidden = 'Access is denied',
  Gateway = 'Something went wrong, please try again later',
}

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req?.headers?.authorization) {
      next(new ForbiddenException(ErrorMessage.Forbidden));
    }

    const token = req.headers.authorization?.split(' ')?.[1];

    try {
      const hasAccess = await this.isValidToken(token);
      if (!hasAccess) {
        next(new ForbiddenException(ErrorMessage.Forbidden));
      }

      next();
    } catch (e) {
      next(new BadGatewayException(ErrorMessage.Gateway));
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
