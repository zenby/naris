import { BadGatewayException, ForbiddenException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

enum Message {
  Forbidden = 'Access is denied',
  Gateway = 'Something went wrong, please try again later',
}

export const isValidToken = async (token: string): Promise<boolean> => {
  const path = process.env.AUTH_PATH;
  const { data } = await axios.post(path, { token });
  // TODO: not sure
  return data?.status === 'ok';
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.headers?.authorization) {
    next(new ForbiddenException(Message.Forbidden));
  }

  const token = req.headers.authorization?.split(' ')?.[1];

  try {
    // checking the token in the auth project
    const isAccess = await isValidToken(token);

    if (isAccess) {
      next();
    } else {
      next(new ForbiddenException(Message.Forbidden));
    }
  } catch (e) {
    // if the error is in the auth service
    next(new BadGatewayException(Message.Gateway));
  }
};
