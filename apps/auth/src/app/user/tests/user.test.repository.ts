import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, SaveOptions, UpdateResult } from 'typeorm';
import { UserEntity } from '../user.entity';
import { testUsers } from './test.users';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

type CriteriaParameter = string | string[] | number | number[] | Date | Date[] | FindOptionsWhere<UserEntity>;

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
    await entity.hashPassword();
    return entity;
  }

  async update(_criteria: CriteriaParameter, _entity: QueryDeepPartialEntity<UserEntity>): Promise<UpdateResult> {
    return {} as UpdateResult;
  }

  async delete(_criteria: CriteriaParameter): Promise<DeleteResult> {
    return {} as DeleteResult;
  }
}
