import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, SaveOptions, UpdateResult } from 'typeorm';
import { UserEntity } from '../user.entity';
import { testUsers } from './test.users';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class UserTestRepository {
  private readonly users = testUsers;

  async find(options?: FindManyOptions<UserEntity>): Promise<UserEntity[]> {
    if (options === undefined) {
      return this.users;
    }
  }

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

  async save(entity: UserEntity, _options?: SaveOptions): Promise<UserEntity> {
    if (this.users.includes(entity)) {
      return null;
    }
    return entity;
  }

  async update(
    criteria: string | string[] | number | number[] | Date | Date[] | FindOptionsWhere<UserEntity>,
    partialEntity: QueryDeepPartialEntity<UserEntity>
  ): Promise<UpdateResult> {
    return {} as UpdateResult;
  }

  async delete(
    criteria: string | string[] | number | number[] | Date | Date[] | FindOptionsWhere<UserEntity>
  ): Promise<DeleteResult> {
    return {} as DeleteResult;
  }
}
