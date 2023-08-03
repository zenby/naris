import { UserEntity } from '../../user/user.entity';
import { Fingerprint } from '../helpers/fingerprint';
import { Request } from 'express';
import { Configuration } from '../../config/config';
import * as jwt from 'jsonwebtoken';
import * as superagent from 'superagent';
import * as supertest from 'supertest';

export function getJWTConfigMock(config: Configuration['jwt']) {
  return {
    get: (): Configuration['jwt'] => config,
  };
}

export type AuthRequestMakeType = <TRequest extends superagent.SuperAgentRequest>(request: TRequest) => TRequest;

export const createUserAuthRequestFactory = (config: Configuration['jwt'], fingerprint: Fingerprint) => {
  return (request: supertest.Test, user: UserEntity) => {
    const userTokenGenerator = userFactory(config);
    const accessToken = userTokenGenerator(user, fingerprint);
    const authRequestMakerFn = authRequestMakerFactory(config.cookieName, fingerprint);
    return authRequestMakerFn(request, accessToken);
  };
};

export const createRequest = (ipAddresses: string[], userAgent: string): Request => {
  return {
    headers: {
      'x-original-forwarded-for': ipAddresses.join(', '),
      'user-agent': userAgent,
    },
  } as unknown as Request;
};

export const authRequestMakerFactory = (jwtCookieName: string, fingerprint: Fingerprint) => {
  const getAuthHeaders = (fingerprint: Fingerprint, jwtToken?: string) => {
    const result: { [key: string]: string } = {
      'x-original-forwarded-for': fingerprint.ipAddresses.join(','),
      'user-agent': fingerprint.userAgent,
    };

    return jwtToken ? { ...result, Cookie: [`${jwtCookieName}=${jwtToken}`] } : result;
  };

  const authRequestMaker = <TRequest extends superagent.SuperAgentRequest>(request: TRequest, jwtToken?: string) => {
    const headers = getAuthHeaders(fingerprint, jwtToken);
    return request.set(headers);
  };

  return authRequestMaker;
};

export const userFactory = (config: Configuration['jwt']) => {
  return (user: UserEntity, requestFingerprint: Fingerprint, expiredInSec?: number) => {
    const { jwtSecret: secret, expiresInRefresh } = config;
    const iat = Math.floor(Date.now() / 1000) + expiredInSec;
    return jwt.sign(
      { userId: user.id, userEmail: user.email, userRole: user.role, fingerprint: requestFingerprint.toString(), iat },
      secret,
      { expiresIn: expiresInRefresh }
    );
  };
};
