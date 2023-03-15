import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwt-payload.interface';

export class JwtTestHelper {
  static readonly defaultSecret = 'defaultSecretForTest';
  static readonly defaultPayload: JwtPayload = {
    id: 1,
    email: 'test@ya.ru',
    uuid: '11111111-1111-4111-9111-111111111111',
  };

  constructor(public readonly secret: string = JwtTestHelper.defaultSecret) {}

  createJwt(payload: JwtPayload) {
    return JwtTestHelper.createJwt(payload, this.secret);
  }

  static createJwt(payload: JwtPayload, secret = JwtTestHelper.defaultSecret) {
    return jwt.sign(payload, secret);
  }

  static createBearerHeader(payload: JwtPayload = JwtTestHelper.defaultPayload, secret = JwtTestHelper.defaultSecret) {
    return {
      Authorization: 'Bearer ' + this.createJwt(payload, secret),
    };
  }
}
