import { Request } from 'express';

const delimiter = '^';
const nameDelimiter = '~';

const FEDelimemeter = '/';

export const setFilenameHelper = (
  request: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void
) => {
  const filename = createFilename(request.body.path, file.originalname);

  return callback(null, filename);
};

function createFilename(filepath: string, originalname: string): string {
  const pathToStore = (filepath || '').replaceAll(FEDelimemeter, delimiter);
  const [date] = new Date().toISOString().split('T');
  const prefix = `${date}-${Math.random().toString(36).substring(2, 10)}`;
  const filename = originalname.replaceAll(' ', '');

  const newFile = `${prefix}${nameDelimiter}${filename}`;

  return pathToStore ? `${pathToStore}${delimiter}${newFile}` : newFile;
}
