import { FingerprintRequestHelper } from './fingerprint-request.helper';
import { Request } from 'express';
import { RequestFingerprint } from '../types/request-fingerprint.interface';

describe('FingerprintRequestHelper', () => {
  let fingerprintHelper: FingerprintRequestHelper;

  beforeEach(() => {
    fingerprintHelper = new FingerprintRequestHelper();
  });

  describe('extractRequestFingerprint', () => {
    it('should extract request fingerprint with valid request', () => {
      const expectedFingerprint = {
        ipAddresses: ['127.0.0.1'],
        userAgent: 'Test User Agent',
      };

      const request: Request = {
        headers: {
          'x-original-forwarded-for': expectedFingerprint.ipAddresses.join(', '),
          'user-agent': expectedFingerprint.userAgent,
        },
      } as unknown as Request;

      const fingerprint = fingerprintHelper.extractRequestFingerprint(request);
      expect(fingerprint).toEqual(expectedFingerprint);
    });

    it('should extract request fingerprint with multiple IP addresses', () => {
      const expectedFingerprint = {
        ipAddresses: ['192.168.1.1', '192.168.1.2', '192.168.1.3'],
        userAgent: 'Test User Agent',
      };

      const request: Request = {
        headers: {
          'x-original-forwarded-for': expectedFingerprint.ipAddresses.join(', '),
          'user-agent': expectedFingerprint.userAgent,
        },
      } as unknown as Request;

      const fingerprint = fingerprintHelper.extractRequestFingerprint(request);
      expect(fingerprint).toEqual(expectedFingerprint);
    });

    it('should extract request fingerprint with missing IP addresses', () => {
      const expectedFingerprint: RequestFingerprint = {
        ipAddresses: [],
        userAgent: 'Test User Agent',
      };

      const request: Request = {
        headers: {
          'user-agent': expectedFingerprint.userAgent,
        },
      } as Request;

      const fingerprint = fingerprintHelper.extractRequestFingerprint(request);
      expect(fingerprint).toEqual(expectedFingerprint);
    });
  });
});
