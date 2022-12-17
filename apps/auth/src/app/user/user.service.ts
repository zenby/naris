import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/sign-in-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

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

  async findByLogin(signInUserDto: SignInUserDto): Promise<UserEntity | Error> {
    const user = await this.userRepository.findOne({ where: { login: signInUserDto.login } });

    if (!user) {
      return new NotFoundException(`User with login ${signInUserDto.login} not found`);
    }

    return user;
  }

  async findByIdAndEmail({ id, email }: { id: number; email: string }): Promise<UserEntity | Error> {
    const user = await this.userRepository.findOne({ where: { id, email } });

    if (!user) {
      return new NotFoundException(`User not found`);
    }

    return user;
  }
}
