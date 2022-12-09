import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { HttpJsonResult, HttpJsonStatus } from '../common/types/http-json-result.interface';
import { Readable } from 'stream';

describe('UploadController', () => {
  let uploadController: UploadController;
  let uploadService: UploadService;
  let file: Express.Multer.File;

  beforeEach(() => {
    uploadService = new UploadService();
    uploadController = new UploadController(uploadService);
    file = {
      filename: 'filename',
      originalname: 'originalname',
      destination: 'destination',
      size: 100500,
      path: 'path',
      mimetype: 'mimetype',
      fieldname: 'fieldname',
      buffer: Buffer.from('buffer'),
      encoding: 'encoding',
      stream: new Readable(),
    };
  });

  describe('UploadedFiles', () => {
    it('should ', async () => {
      const uri = '/my-super-filename.txt';
      const result: HttpJsonResult<{ uri: string }> = { status: HttpJsonStatus.Ok, items: [{ uri }] };

      jest.spyOn(uploadService, 'saveFile').mockImplementation(async () => ({ uri }));

      expect(await uploadController.uploadFiles(file)).toStrictEqual(result);
    });
  });
});
