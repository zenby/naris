import { Request } from 'express';
import { generateFilename } from './generate-filename';
import { validateFile } from './validate-file';

export function uploadHandler(
  { body }: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void
) {
  const { path } = body;
  const { originalname } = file;

  const filename = generateFilename(path, originalname);

  const validationResult = validateFile(path, originalname, filename);

  return callback(validationResult, filename);
}
