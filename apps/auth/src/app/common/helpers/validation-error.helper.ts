import { ValidationError } from '@nestjs/common';

export class ValidationErrorHelper {
  static formatErrors(errors: ValidationError[]): string[] {
    return errors.reduce((acc, error) => {
      acc = Object.values(error.constraints);
      return acc;
    }, []);
  }

  static errorsToString(errors: ValidationError[], separator = ';'): string {
    return errors
      .reduce<string[]>((acc, val) => {
        acc.push(Object.values(val.constraints).join(separator));
        return acc;
      }, [])
      .join(separator);
  }

  static stringToArray(errorString: string, separator = ';'): string[] {
    return errorString.split(separator);
  }
}
