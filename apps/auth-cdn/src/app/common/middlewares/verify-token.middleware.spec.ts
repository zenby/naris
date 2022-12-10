import * as middleware from './verify-token.middleware';
import { NextFunction, Request, Response } from 'express';
import { BadGatewayException, ForbiddenException } from '@nestjs/common';

describe('verify-token middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  const forbiddenError = new ForbiddenException(middleware.Message.Forbidden);

  beforeEach(() => {
    mockRequest = {};
    nextFunction = jest.fn();
  });

  describe('without authorization header', () => {
    it('nextFunction should be throw with forbidden error', async () => {
      mockRequest = {
        headers: {},
      };

      await middleware.verifyToken(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toBeCalledWith(forbiddenError);
      expect(nextFunction).toBeCalledTimes(1);
    });
  });

  describe('with authorization header', () => {
    beforeEach(() => {
      mockRequest = {
        headers: {
          authorization: 'Bearer abc',
        },
      };
    });

    it('nextFunction should be called without params if all ok', async () => {
      jest.spyOn(middleware, 'isValidToken').mockImplementation(async () => Promise.resolve(true));

      await middleware.verifyToken(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toBeCalledWith();
      expect(nextFunction).toBeCalledTimes(1);
    });

    it('nextFunction should be called with forbidden error if token is invalid', async () => {
      jest.spyOn(middleware, 'isValidToken').mockImplementation(async () => Promise.resolve(false));

      await middleware.verifyToken(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toBeCalledWith(forbiddenError);
      expect(nextFunction).toBeCalledTimes(1);
    });

    it('nextFunction should be called with bad gateway error if catch error auth service', async () => {
      jest.spyOn(middleware, 'isValidToken').mockImplementation(async () => Promise.reject(new Error()));

      await middleware.verifyToken(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toBeCalledWith(new BadGatewayException(middleware.Message.Gateway));
      expect(nextFunction).toBeCalledTimes(1);
    });
  });
});
