import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform, ValidationError } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpJsonStatus } from '../types/http-json-result.interface';

export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToInstance(metadata.metatype, value);

    if (typeof value !== 'object') {
      return value;
    }

    const errors = await validate(object);

    if (errors.length === 0) {
      return value;
    }

    throw new HttpException(
      { status: HttpJsonStatus.Error, items: this.formatErrors(errors) },
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }

  formatErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      acc = Object.values(error.constraints);
      return acc;
    }, []);
  }
}
