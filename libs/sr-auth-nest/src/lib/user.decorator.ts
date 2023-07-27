import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((_data, context) => {
  const req = context.switchToHttp().getRequest();
  return req.user;
});
