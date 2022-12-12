import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/config';
import { UserEntity } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInUserDto } from '../user/dto/sign-in-user.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async getAccessToken(user: UserEntity): Promise<string> {
    const { jwtSecret: secret, expiresInAccess: expiresIn } = this.configService.get<Configuration['jwt']>('jwt');

    return await this.jwtService.signAsync({ userId: user.id, userEmail: user.email }, { secret, expiresIn });
  }

  async getRefreshToken(user: UserEntity): Promise<string> {
    const { jwtSecret: secret, expiresInRefresh: expiresIn } = this.configService.get<Configuration['jwt']>('jwt');

    return await this.jwtService.signAsync({ userId: user.id, userEmail: user.email }, { secret, expiresIn });
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity | Error> {
    const userByEmail = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    const userByLogin = await this.userRepository.findOne({ where: { login: createUserDto.login } });

    if (userByEmail || userByLogin) {
      return new HttpException('Email or login has already been taken', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = new UserEntity();

    Object.assign(newUser, createUserDto);

    return await this.userRepository.save(newUser);
  }

  async getComparedUser(signInUserDto: SignInUserDto): Promise<UserEntity | Error> {
    const user = await this.userRepository.findOne({ where: { login: signInUserDto.login } });

    if (!user) {
      return new NotFoundException(`User with login ${signInUserDto.login} not found`);
    }

    const isPasswordsMatch = await compare(signInUserDto.password, user.password);

    if (!isPasswordsMatch) {
      return new UnauthorizedException('Invalid password');
    }

    return user;
  }
}
