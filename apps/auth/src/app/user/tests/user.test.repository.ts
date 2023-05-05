import { FindOneOptions, FindOptionsWhere, SaveOptions } from 'typeorm';
import { UserEntity } from '../user.entity';
import { testUsers } from './test.users';

export class UserTestRepository {
  private readonly users = testUsers;

  async findOne(options: FindOneOptions<UserEntity>): Promise<UserEntity> {
    const query = options.where as FindOptionsWhere<UserEntity>;
    if (query.email !== undefined) {
      return this.users.find((x) => {
        return x.email === query.email;
      });
    }
    if (query.login !== undefined) {
      return this.users.find((x) => {
        return x.login === query.login;
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
