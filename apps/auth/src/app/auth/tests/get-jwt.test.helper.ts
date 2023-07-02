import { UserEntity } from '../../user/user.entity';
import { Fingerprint } from '../helpers/fingerprint';
import * as jwt from 'jsonwebtoken';
import { testConfig } from './auth.test.config';
import { Request } from 'express';

export const createRequest = (ipAddresses: string[], userAgent: string): Request => {
  return {
    headers: {
      'x-original-forwarded-for': ipAddresses.join(', '),
      'user-agent': userAgent,
    },
  } as unknown as Request;
};

export const getJWTTokenForUserWithRole = (user: UserEntity, requestFingerprint: Fingerprint) => {
  const { jwtSecret, expiresInRefresh } = testConfig;

  return jwt.sign({ userId: user.id, userEmail: user.email, fingerprint: requestFingerprint.toString() }, jwtSecret, {
    expiresIn: expiresInRefresh,
  });
};

export const getJWTTokenForUserWithFingerprint = (
  user: UserEntity,
  requestFingerprint: Fingerprint,
  expiredInSec?: number
) => {
  const { jwtSecret: secret } = testConfig;
  const iat = Math.floor(Date.now() / 1000) + expiredInSec;
  return jwt.sign({ userId: user.id, userEmail: user.email, fingerprint: requestFingerprint.toString(), iat }, secret);
};
