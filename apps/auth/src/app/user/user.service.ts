import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { ValidationErrorHelper } from '../common/helpers/validation-error.helper';
import { UserInfoDto } from './dto/user-info-dto';

@Injectable()
export class UserService {
  logger = new Logger(UserService.name);

  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity | Error> {
    const newUser = new UserEntity();

    Object.assign(newUser, createUserDto);

    const errors = await validate(newUser);

    if (errors?.length > 0) {
      this.logger.error(errors);
      return new UnprocessableEntityException(ValidationErrorHelper.errorsToString(errors));
    }

    this.logger.log('Try to create user' + JSON.stringify(createUserDto));
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

  async getUsers(): Promise<UserEntity[] | Error> {
    return await this.userRepository.find();
  }

  async deleteUser(id: number): Promise<DeleteResult | Error> {
    return await this.userRepository.delete({ id: id });
  }

  async changeBlockStatus(id: number, isBlocked: boolean): Promise<void | Error> {
    await this.userRepository.update({ id }, { isBlocked });
  }

  async updateUserInfo(uuid: string, userInfoDto: UserInfoDto): Promise<UpdateResult | Error> {
    return await this.userRepository.update({ uuid }, userInfoDto);
  }
}
