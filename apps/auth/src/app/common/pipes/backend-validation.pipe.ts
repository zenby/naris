import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpJsonStatus } from '@soer/sr-common-interfaces';
import { ValidationErrorHelper } from '../helpers/validation-error.helper';

export class BackendValidationPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    const object = plainToInstance(metadata.metatype, value);

    if (typeof value !== 'object') {
      return value;
    }

    const errors = await validate(object);

    if (errors.length === 0) {
      return value;
    }

    throw new HttpException(
      { status: HttpJsonStatus.Error, items: ValidationErrorHelper.formatErrors(errors) },
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }
}
