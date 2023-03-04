import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/config';
import { UserEntity } from '../user/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { compare } from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  async getAccessToken(user: UserEntity): Promise<string> {
    const { jwtSecret: secret, expiresInAccess: expiresIn } = this.configService.get<Configuration['jwt']>('jwt');

    return this.jwtService.signAsync({ id: user.id, uuid: user.uuid, email: user.email }, { secret, expiresIn });
  }

  async getRefreshToken(user: UserEntity): Promise<string | Error> {
    if (user instanceof Error) {
      return user;
    }

    const { jwtSecret: secret, expiresInRefresh: expiresIn } = this.configService.get<Configuration['jwt']>('jwt');

    return await this.jwtService.signAsync({ userId: user.id, userEmail: user.email }, { secret, expiresIn });
  }

  async compareUsersByPassword(signInUserDto: LoginUserDto, userFromDb: UserEntity): Promise<boolean | Error> {
    const isPasswordsMatch = await compare(signInUserDto.password, userFromDb.password);

    if (!isPasswordsMatch) {
      return new UnauthorizedException('Invalid password');
    }

    return true;
  }

  async getVerifiedUserByRefreshToken(refreshToken: string): Promise<UserEntity | Error> {
    try {
      const { jwtSecret: secret, expiresInRefresh: maxAge } = this.configService.get<Configuration['jwt']>('jwt');

      const { userEmail, userId } = this.jwtService.verify<{ userId: number; userEmail: string }>(refreshToken, {
        secret,
        maxAge,
      });

      const userOrError = await this.userService.findByIdAndEmail({
        id: userId,
        email: userEmail,
      });
      if (userOrError instanceof Error) return userOrError;

      return userOrError;
    } catch (error) {
      if (error instanceof TokenExpiredError) return error;

      throw error;
    }
  }

  async validateUser(signInUserDto: LoginUserDto): Promise<any> {
    const user = await this.userService.findByLogin(signInUserDto);

    if (user instanceof Error) {
      return user;
    }

    const isPasswordsMatch = await this.compareUsersByPassword(signInUserDto, user);

    if (isPasswordsMatch instanceof Error) {
      return isPasswordsMatch;
    }

    return user;
  }

}
