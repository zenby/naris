import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { Readable } from 'stream';

describe('ResourceController', () => {
  let resourceController: ResourceController;
  let resourceService: ResourceService;
  let file: Express.Multer.File;

  beforeEach(() => {
    resourceService = new ResourceService();
    resourceController = new ResourceController(resourceService);
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

  describe('ResourceedFile', () => {
    it('should return HttpJsonResult with file uri', async () => {
      const uri = '/my-super-filename.txt';
      const result: HttpJsonResult<{ uri: string }> = { status: HttpJsonStatus.Ok, items: [{ uri }] };

      jest.spyOn(resourceService, 'saveFile').mockImplementation(async () => ({ uri }));

      expect(await resourceController.uploadFile(file, { path: 'smth' })).toStrictEqual(result);
    });
  });
});
