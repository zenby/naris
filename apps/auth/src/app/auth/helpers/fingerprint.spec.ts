import { Fingerprint } from './fingerprint';
import { createRequest } from '../tests/get-jwt.test.helper';
import { testFingerprint } from '../../user/tests/test.users';

describe('Fingerprint', () => {
  describe('toString', () => {
    it('should return the hash of the fingerprint string', () => {
      const result = testFingerprint.toString();

      expect(result).toMatch(/^[0-9a-f]{32}$/);
    });
  });

  describe('constructor', () => {
    it('should initialize ipAddresses and userAgent properties', () => {
      const userAgent = 'Mozilla/5.0';
      const ipAddresses = ['127.0.0.1', '192.168.0.1'];

      const fingerprint = new Fingerprint(createRequest(ipAddresses, userAgent));

      expect(fingerprint.ipAddresses).toEqual(ipAddresses);
      expect(fingerprint.userAgent).toEqual(userAgent);
    });
  });
});
