import { FileValidator } from '@nestjs/common';
import { DELIMETERS, ERRORS } from '../constants';

export class OriginalFilenameValidator extends FileValidator {
  isValid(file: Express.Multer.File): boolean {
    const nameRegexp = new RegExp(`[\\${DELIMETERS.FOLDER}\\${DELIMETERS.NAME}\\${DELIMETERS.PATH}]`);

    return !file.originalname.match(nameRegexp);
  }

  buildErrorMessage(): string {
    return ERRORS.FILENAME_HAS_SYSTEM_SYMBOLS;
  }
}
