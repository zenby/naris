import { FindOneOptions, FindOptionsWhere, SaveOptions } from 'typeorm';
import { UserEntity } from '../user.entity';
import { TEST_USERS } from './test.users';

export class UserTestRepository {
  private readonly users = TEST_USERS;

  async findOne(options: FindOneOptions<UserEntity>): Promise<UserEntity> {
    const query = options.where as FindOptionsWhere<UserEntity>;
    if (query.email !== undefined) {
      return this.users.find((x) => {
        return x.email === query.email;
      });
    }

    return null;
  }

  async save(entity: UserEntity, options?: SaveOptions): Promise<UserEntity> {
    if (this.users.includes(entity)) {
      return null;
    }
    return entity;
  }
}
