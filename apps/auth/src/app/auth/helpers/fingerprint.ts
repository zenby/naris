import { createHash } from 'crypto';
import { Request } from 'express';

export class Fingerprint {
  readonly ipAddresses: string[];
  readonly userAgent: string;

  constructor(request: Request) {
    this.ipAddresses = this.extractIpAddresses(request);
    this.userAgent = request.headers['user-agent'];
  }

  toString(): string {
    return createHash('md5')
      .update(`${this.ipAddresses.join('')}${this.userAgent}`)
      .digest('hex');
  }

  private extractIpAddresses(request: Request): string[] {
    const xForwardedFor = request.headers['x-original-forwarded-for'];
    const ipAddresses: string[] = [];

    if (Array.isArray(xForwardedFor)) {
      ipAddresses.push(...xForwardedFor);
    } else if (typeof xForwardedFor === 'string') {
      const addresses = xForwardedFor.split(',').map((v) => v.trim());
      ipAddresses.push(...addresses);
    }

    return this.sortAndUniqueIpAddresses(ipAddresses);
  }

  private sortAndUniqueIpAddresses(ipAddresses: string[]): string[] {
    const uniqueIps = [...new Set(ipAddresses)];
    return uniqueIps.sort();
  }
}
