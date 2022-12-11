import { BadGatewayException, ForbiddenException, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export enum Message {
  Forbidden = 'Access is denied',
  Gateway = 'Something went wrong, please try again later',
}

export const isValidToken = async (token: string): Promise<boolean> => {
  try {
    verify(token, process.env.JWT_SECRET);
    return true;
  } catch (e) {
    Logger.warn(e, 'Token validation');
    return false;
  }
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req?.headers?.authorization) {
    next(new ForbiddenException(Message.Forbidden));
    return;
  }

  const token = req.headers.authorization?.split(' ')?.[1];

  try {
    // checking the token in the auth project
    const isAccess = await isValidToken(token);

    if (isAccess) {
      next();
      return;
    } else {
      next(new ForbiddenException(Message.Forbidden));
      return;
    }
  } catch (e) {
    // if the error is in the auth service
    next(new BadGatewayException(Message.Gateway));
    return;
  }
};
