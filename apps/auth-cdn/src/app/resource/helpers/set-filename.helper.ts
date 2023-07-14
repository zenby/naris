import { Request } from 'express';
import { DELIMETERS, ERRORS } from '../constants';
import { BadRequestException } from '@nestjs/common';

const MAX_FILENAME_LENGTH = 256;

export const setFilenameHelper = (
  { body }: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void
) => {
  const { path } = body;
  const { originalname } = file;

  const filename = createFilename(path, originalname);

  const validationResult = validateFile(filename);

  return callback(validationResult, filename);
};

function validateFile(filename: string) {
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
