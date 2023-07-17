import { DELIMETERS } from '../constants';

/* 
    Example:
    images, barak.jpg => images!2023-07-14-8d2oboet~barak.jpg
 */
export function generateFilename(filepath: string, originalname: string): string {
  const path = (filepath || '').replaceAll(DELIMETERS.PATH, DELIMETERS.FOLDER);
  const [date] = new Date().toISOString().split('T');
  const prefix = `${date}-${Math.random().toString(36).substring(2, 10)}`;

  const newFile = `${prefix}${DELIMETERS.NAME}${originalname}`;

  return path ? `${path}${DELIMETERS.FOLDER}${newFile}` : newFile;
}
