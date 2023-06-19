import { Request } from 'express';
import { RequestFingerprint } from '../types/request-fingerprint.interface';

export class FingerprintRequestHelper {
  extractRequestFingerprint(request: Request): RequestFingerprint {
    const ipAddresses: string[] = this.extractIpAddresses(request);
    const userAgent = request.headers['user-agent'];

    return { ipAddresses: ipAddresses, userAgent: userAgent };
  }

  private extractIpAddresses(request: Request): string[] {
    const xForwardedFor = request.headers['x-original-forwarded-for'];
    const ipAddresses: string[] = [];

    if (Array.isArray(xForwardedFor)) {
      ipAddresses.push(...xForwardedFor);
    } else if (typeof xForwardedFor === 'string') {
      const addresses = xForwardedFor.split(',');
      ipAddresses.push(...addresses);
    }

    return ipAddresses;
  }
}
