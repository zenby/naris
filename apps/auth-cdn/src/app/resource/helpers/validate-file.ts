import { BadRequestException } from '@nestjs/common';
import {
  ERRORS,
  FILENAME_WITHOUT_SYSTEM_SYMBOLS_REGEXP,
  MAX_FILENAME_LENGTH,
  PATH_WITHOUT_SYSTEM_SYMBOLS_REGEXP,
} from '../constants';

export function validateFile(path = '', originalname: string, filename: string) {
  if (path.match(PATH_WITHOUT_SYSTEM_SYMBOLS_REGEXP)) {
    return new BadRequestException(ERRORS.PATH_HAS_SYSTEM_SYMBOLS);
  }

  if (originalname.match(FILENAME_WITHOUT_SYSTEM_SYMBOLS_REGEXP)) {
    return new BadRequestException(ERRORS.FILENAME_HAS_SYSTEM_SYMBOLS);
  }

  if (filename.length > MAX_FILENAME_LENGTH) {
    return new BadRequestException(ERRORS.FILENAME_IS_TOO_LONG);
  }

  if (filename !== encodeURIComponent(filename)) {
    return new BadRequestException(ERRORS.SHOULD_USE_VALID_SYMBOLS);
  }

  return null;
}
