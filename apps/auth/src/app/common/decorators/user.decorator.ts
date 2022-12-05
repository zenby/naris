import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExpressRequestInterface } from '../interfaces/express-request.interface';

export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<ExpressRequestInterface>();

  if (!request.user) {
    return null;
  }

  if (data) {
    return request.user[data];
  }

  return request.user;
});
