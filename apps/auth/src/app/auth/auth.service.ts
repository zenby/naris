import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  async getAccessToken(token: string): Promise<string> {
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('jwtSecret'),
    });

    return await this.jwtService.signAsync(
      { userId: decoded.id, userEmail: decoded.email },
      { secret: this.configService.get('jwtSecret'), expiresIn: this.configService.get('expAccess') }
    );
  }
}
