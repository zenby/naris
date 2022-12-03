import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async getAccessToken(token: string) {
    const decoded = await this.decodeToken(token);

    const accessToken = await this.generateAccessToken(decoded.id, decoded.email);

    return { status: 'ok', items: [{ token: accessToken }] };
  }

  private async generateAccessToken(userId: number, userEmail: string): Promise<string> {
    try {
      return await this.jwtService.signAsync({ userId, userEmail });
    } catch (e) {
      throw new HttpException('Failed to generate token', 500);
    }
  }

  private async decodeToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      throw new HttpException('Failed to decrypt token', 500);
    }
  }
}
