import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { ValidationErrorHelper } from '../common/helpers/validation-error.helper';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity | Error> {
    const newUser = new UserEntity();

    Object.assign(newUser, createUserDto);

    const errors = await validate(newUser);

    if (errors?.length > 0) {
      return new UnprocessableEntityException(ValidationErrorHelper.errorsToString(errors));
    }

    return await this.userRepository.save(newUser).catch(() => {
      return new UnprocessableEntityException(`User with email ${newUser.email} has been already exist`);
    });
  }

  async findByLogin(login: string): Promise<UserEntity | Error> {
    const user = await this.userRepository.findOne({ where: { login } });

    if (!user) {
      return new NotFoundException(`User with login ${login} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | Error> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async findByIdAndEmail({ id, email }: { id: number; email: string }): Promise<UserEntity | Error> {
    return await this.userRepository.findOne({ where: { id, email } });
  }
}
