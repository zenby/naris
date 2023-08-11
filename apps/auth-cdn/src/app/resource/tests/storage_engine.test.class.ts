import { StorageEngine } from 'multer';
import { Request } from 'express';
import { Stream } from 'node:stream';

export class TestStorageEngine implements StorageEngine {
  constructor(
    private destination: string,
    private getFilename: (
      reg: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => void
  ) {}

  public _handleFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error?: null | Error, info?: Partial<Express.Multer.File>) => void
  ): void {
    this.getFilename(req, file, (error: Error | null, filename: string): void => {
      if (error) {
        return callback(error);
      }

      const writableStream = new Stream.Writable();

      writableStream._write = (_chunk, _encoding, next) => {
        callback(null, {
          destination: this.destination,
          filename: filename,
        });
        next();
      };

      file.stream.pipe(writableStream);
    });
  }

  public _removeFile(_req: Request, _file: Express.Multer.File, _callback: (error: Error | null) => void): void {
    // This method needs to be implemented to test file removing. For now it is an empty stab
    console.error(
      'TestStorageEngine class needs to be developed to test file removing. Method _removeFile is not implemented'
    );
  }
}
