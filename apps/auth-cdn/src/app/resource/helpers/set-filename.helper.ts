import { extname } from 'path';
import { Request } from 'express';

export const setFilenameHelper = (
  request: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void
) => {
  console.log(request.body);
  const suffix = `folder^${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const ext = extname(file.originalname);

  const filename = `${suffix}${ext}`;

  return callback(null, filename);
};
