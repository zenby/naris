import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtPayloadFromRequest = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.user) {
    return null;
  }

  if (data) {
    return request.user[data];
  }

  return request.user;
});
