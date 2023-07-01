import { Fingerprint } from './fingerprint';
import { createRequest } from '../tests/get-jwt.test.helper';

describe('Fingerprint', () => {
  describe('constructor', () => {
    it('should initialize ipAddresses and userAgent properties', () => {
      const userAgent = 'Mozilla/5.0';
      const ipAddresses = ['127.0.0.1', '192.168.0.1'];

      const fingerprint = new Fingerprint(createRequest(ipAddresses, userAgent));

      expect(fingerprint.ipAddresses).toEqual(ipAddresses);
      expect(fingerprint.userAgent).toEqual(userAgent);
    });
  });

  describe('validateCompare', () => {
    it('should return true for matching fingerprints', () => {
      const fingerprint1 = new Fingerprint(createRequest(['127.0.0.1'], 'Mozilla/5.0'));
      const fingerprint2 = new Fingerprint(createRequest(['127.0.0.1'], 'Mozilla/5.0'));

      expect(Fingerprint.validateCompare(fingerprint1, fingerprint2)).toBe(true);
    });

    it('should return false for non-matching fingerprints', () => {
      const fingerprint1 = new Fingerprint(createRequest(['127.0.0.1'], 'Mozilla/5.0'));
      const fingerprint2 = new Fingerprint(createRequest(['192.168.0.1'], 'Chrome/91.0.4472.124'));

      expect(Fingerprint.validateCompare(fingerprint1, fingerprint2)).toBe(false);
    });
  });
});
