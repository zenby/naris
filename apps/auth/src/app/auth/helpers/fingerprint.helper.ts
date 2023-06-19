import * as crypto from 'crypto';
import { RequestFingerprint } from '../types/request-fingerprint.interface';

export class FingerprintHelper {
  generateFingerprint(requestFingerprint: RequestFingerprint): string {
    const concatData = this.concatRequestFingerprint(requestFingerprint);
    return crypto.createHash('md5').update(concatData).digest('hex');
  }

  compareFingerprint(requestFingerprint: RequestFingerprint, fingerprint: string): boolean {
    const currentFingerprint = this.generateFingerprint(requestFingerprint);
    return fingerprint === currentFingerprint;
  }

  private concatRequestFingerprint(requestFingerprint: RequestFingerprint): string {
    const sortedIPs = this.sortAndUniqueIpAddresses(requestFingerprint.ipAddresses);
    return `${sortedIPs.join('')}${requestFingerprint.userAgent}`;
  }

  private sortAndUniqueIpAddresses(ipAddresses: string[]): string[] {
    const uniqueIps = [...new Set(ipAddresses)];
    return uniqueIps.sort();
  }
}
