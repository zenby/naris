import { Request } from 'express';
import {
  DELIMETERS,
  ERRORS,
  FILENAME_WITHOUT_SYSTEM_SYMBOLS_REGEXP,
  MAX_FILENAME_LENGTH,
  PATH_WITHOUT_SYSTEM_SYMBOLS_REGEXP,
} from '../constants';
import { BadRequestException } from '@nestjs/common';

export const setFilenameHelper = (
  { body }: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void
) => {
  const { path } = body;
  const { originalname } = file;

  const filename = createFilename(path, originalname);

  const validationResult = validateFile(path, originalname, filename);

  return callback(validationResult, filename);
};

function validateFile(path = '', originalname: string, filename: string) {
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

function createFilename(filepath: string, originalname: string): string {
  const pathToStore = (filepath || '').replaceAll(DELIMETERS.PATH, DELIMETERS.FOLDER);
  const [date] = new Date().toISOString().split('T');
  const prefix = `${date}-${Math.random().toString(36).substring(2, 10)}`;
  const filename = originalname.replaceAll(' ', '');

  const newFile = `${prefix}${DELIMETERS.NAME}${filename}`;

  return pathToStore ? `${pathToStore}${DELIMETERS.FOLDER}${newFile}` : newFile;
}
