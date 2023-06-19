import { UserEntity } from '../../user/user.entity';
import { RequestFingerprint } from '../types/request-fingerprint.interface';
import { FingerprintHelper } from '../helpers/fingerprint.helper';
import * as jwt from 'jsonwebtoken';
import { testConfig } from './auth.test.config';

export const getJWTTokenForUserWithRole = (user: UserEntity, requestFingerprint: RequestFingerprint) => {
  const fingerprint = new FingerprintHelper().generateFingerprint(requestFingerprint);
  const { jwtSecret, expiresInRefresh } = testConfig;

  return jwt.sign({ userId: user.id, userEmail: user.email, fingerprint }, jwtSecret, { expiresIn: expiresInRefresh });
};

export const getJWTTokenForUserWithFingerprint = (
  user: UserEntity,
  requestFingerprint: RequestFingerprint,
  expiredInSec?: number
) => {
  const fingerprint = new FingerprintHelper().generateFingerprint(requestFingerprint);
  const { jwtSecret: secret } = testConfig;
  const iat = Math.floor(Date.now() / 1000) + expiredInSec;
  return jwt.sign({ userId: user.id, userEmail: user.email, fingerprint, iat }, secret);
};
