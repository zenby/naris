import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/config';
import { UserEntity } from '../user/user.entity';
import { SignInUserDto } from '../user/dto/sign-in-user.dto';
import { compare } from 'bcrypt';
import { HttpJsonResult, HttpJsonStatus } from '../common/types/http-json-result.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  async getAccessToken(user: UserEntity): Promise<string> {
    const { jwtSecret: secret, expiresInAccess: expiresIn } = this.configService.get<Configuration['jwt']>('jwt');

    return await this.jwtService.signAsync({ userId: user.id, userEmail: user.email }, { secret, expiresIn });
  }

  async getRefreshToken(user: UserEntity): Promise<string> {
    const { jwtSecret: secret, expiresInRefresh: expiresIn } = this.configService.get<Configuration['jwt']>('jwt');

    return await this.jwtService.signAsync({ userId: user.id, userEmail: user.email }, { secret, expiresIn });
  }

  async compareUsersByPassword(signInUserDto: SignInUserDto, userFromDb: UserEntity): Promise<boolean | Error> {
    const isPasswordsMatch = await compare(signInUserDto.password, userFromDb.password);

    if (!isPasswordsMatch) {
      return new UnauthorizedException('Invalid password');
    }

    return true;
  }

  generateError(errorMessage: string): HttpJsonResult<string> {
    return { status: HttpJsonStatus.Error, items: [errorMessage] };
  }
}
