import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/config';
import { UserEntity } from '../user/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { compare } from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  async signIn(signInUserDto: LoginUserDto): Promise<string | Error> {
    const user = await this.userService.findByLogin(signInUserDto);

    if (user instanceof Error) {
      return user;
    }

    const isPasswordsMatch = await this.compareUsersByPassword(signInUserDto, user);

    if (isPasswordsMatch instanceof Error) {
      return isPasswordsMatch;
    }

    return await this.getRefreshToken(user);
  }

  async signUp(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  async getAccessToken(user: UserEntity): Promise<string> {
    const { jwtSecret: secret, expiresInAccess: expiresIn } = this.configService.get<Configuration['jwt']>('jwt');

    return await this.jwtService.signAsync({ userId: user.id, userEmail: user.email }, { secret, expiresIn });
  }

  async getRefreshToken(user: UserEntity): Promise<string> {
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

  async authByOID(email: string): Promise<UserEntity | Error> {
    const user = await this.userService.findByEmail(email);
    if (user instanceof UserEntity) return user;
    const login = email.split('@')[0];
    const newUserDto: CreateUserDto = {login: login, email: email, password: ''};
    return await this.userService.createUser(newUserDto)
  }

}
