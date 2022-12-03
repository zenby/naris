import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

// TODO: where to store?
const JWT_SECRET = 'Some random key here';

@Injectable()
export class AuthService {
  getAccessToken(token: string) {
    const { userId, userEmail } = this.decodeRefreshToken(token);

    return { status: 'ok', items: [{ token: this.generateAccessToken(userId, userEmail) }] };
  }

  private generateAccessToken(userId: string, userEmail: string): string {
    return sign({ userId, userEmail }, JWT_SECRET, { expiresIn: 60 * 15 });
  }

  // TODO: check userId type
  private decodeRefreshToken(token: string): { userId: string; userEmail: string } {
    const { userId, userEmail } = verify(token, JWT_SECRET);
    return { userId, userEmail };
  }
}
