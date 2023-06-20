import { FingerprintHelper } from './fingerprint.helper';

describe('FingerprintHelper', () => {
  let fingerprintHelper: FingerprintHelper;

  const requestFingerprint = {
    ipAddresses: ['192.168.0.1', '192.168.0.2', '192.168.0.1'],
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  };

  beforeEach(() => {
    fingerprintHelper = new FingerprintHelper();
  });

  describe('generateFingerprint', () => {
    it('should generate a valid fingerprint for a given request fingerprint', () => {
      const generatedFingerprint = fingerprintHelper.generateFingerprint(requestFingerprint);

      expect(generatedFingerprint).toMatch(/^[0-9a-f]{32}$/);
    });
  });

  describe('compareFingerprint', () => {
    it('should return true if the provided fingerprint matches the generated fingerprint', () => {
      const generatedFingerprint = fingerprintHelper.generateFingerprint(requestFingerprint);

      const result = fingerprintHelper.compareFingerprint(requestFingerprint, generatedFingerprint);
      expect(result).toBe(true);
    });

    it('should return false if the provided fingerprint does not match the generated fingerprint', () => {
      const generatedFingerprint = fingerprintHelper.generateFingerprint(requestFingerprint);

      const modifiedFingerprint = generatedFingerprint.slice(0, -1) + '0';

      const result = fingerprintHelper.compareFingerprint(requestFingerprint, modifiedFingerprint);
      expect(result).toBe(false);
    });
  });
});
