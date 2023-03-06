import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateUserOpenIdDto } from '../user/dto/create-user-open-id.dto';
import { Configuration } from '../config/config';

@Injectable()
export class AuthOpenIdService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  async authByOpenID(email: string): Promise<UserEntity | Error> {
    let user = await this.userService.findByEmail(email);
    if (user instanceof NotFoundException) {
      const createUserDto: CreateUserOpenIdDto = {
        email: email,
      };

      user = await this.userService.createUserByOpenId(createUserDto);
    }

    return user;
  }

  async getRefreshToken(user: UserEntity | Error): Promise<string | Error> {
    if (user instanceof Error) {
      return user;
    }

    const { jwtSecret: secret, expiresInRefresh: expiresIn } = this.configService.get<Configuration['jwt']>('jwt');

    return await this.jwtService.signAsync({ userId: user.id, userEmail: user.email }, { secret, expiresIn });
  }
}
