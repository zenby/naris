import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { validate } from 'class-validator';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity | Error> {
    const userByEmail = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    const userByLogin = await this.userRepository.findOne({ where: { login: createUserDto.login } });

    if (userByEmail || userByLogin) {
      return new UnprocessableEntityException('Email or login has already been taken');
    }

    const newUser = new UserEntity();

    Object.assign(newUser, createUserDto);

    const errors = await validate(newUser);

    if (errors?.length > 0) {
      const errorsString = errors.reduce<string[]>((acc, val) => {
        acc.push(Object.values(val.constraints).join(';'));
        return acc;
      }, []);

      return new UnprocessableEntityException(errorsString.join(';'));
    }

    return await this.userRepository.save(newUser);
  }

  async findByLogin(signInUserDto: LoginUserDto): Promise<UserEntity | Error> {
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
