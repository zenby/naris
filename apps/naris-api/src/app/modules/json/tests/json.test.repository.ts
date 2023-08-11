import { DeleteResult, FindManyOptions, FindOneOptions, FindOperator, FindOptionsWhere, SaveOptions } from 'typeorm';
import { JsonEntity } from '../json.entity';
import { testDocuments } from './json.test.documents';

export class JsonTestRepository {
  private readonly documents = testDocuments;

  save(entity: JsonEntity, _options?: SaveOptions): Promise<JsonEntity> {
    return Promise.resolve(entity);
  }

  async find(options?: FindManyOptions<JsonEntity>): Promise<JsonEntity[]> {
    if (options === undefined) {
      return this.documents;
    }

    if (options?.where) {
      const queries = options.where instanceof Array ? options.where : [options.where];
      const results = queries.flatMap((query) => this.findEntitiesByQuery(query));
      return results;
    }
  }

  async findOne(options: FindOneOptions<JsonEntity>): Promise<JsonEntity> {
    const query = options.where as FindOptionsWhere<JsonEntity>;

    const findResult = this.documents.find((x) => {
      const comparedProps = Object.entries(query).map(([key, val]) => x[key as keyof JsonEntity] === val);

      return comparedProps.every((elem) => elem === true);
    });

    return Object.assign({}, findResult);
  }

  async delete(_criteria: FindOptionsWhere<JsonEntity>): Promise<DeleteResult> {
    return {} as DeleteResult;
  }

  async count(_options?: FindManyOptions<JsonEntity>): Promise<number> {
    return this.documents.length;
  }

  private findEntitiesByQuery(query: FindOptionsWhere<JsonEntity>): JsonEntity[] {
    return this.documents.filter((x) => {
      const comparedProps = Object.entries(query).map(([key, val]) =>
        this.compareWithQueryField(x[key as keyof JsonEntity], val)
      );
      return comparedProps.every(Boolean);
    });
  }

  private compareWithQueryField<T>(entityField: T, queryField: T | FindOperator<T>[]): boolean {
    if (queryField instanceof FindOperator) {
      const findValues: T[] = queryField.value;
      switch (queryField.type) {
        case 'in':
          return findValues.some((elem) => entityField === elem);
          break;
        default:
          return false;
          break;
      }
    }

    return entityField === queryField;
  }
}
