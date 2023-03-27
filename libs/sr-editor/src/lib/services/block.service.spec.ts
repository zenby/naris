import { faker } from '@faker-js/faker';
import { TextBlock } from '../interfaces/document.model';
import { BlockService } from './block.service';

describe('BlockService', () => {
  let service: BlockService;
  let blocks: TextBlock[];

  beforeEach(() => {
    service = new BlockService();
    jest.spyOn(service.onBlockStatesChange, 'next');
    blocks = createFakeTextBlocks();
  });

  describe('init', () => {
    it('should dispatch block states', () => {
      service.init(blocks);

      expect(service.onBlockStatesChange.next).toBeCalled();
    });
  });
});

function createFakeTextBlocks(): TextBlock[] {
  return [
    { text: faker.random.words(1), type: 'markdown' },
    { text: faker.random.words(3), type: 'markdown' },
    { text: faker.random.words(5), type: 'markdown' },
    { text: faker.random.words(7), type: 'markdown' },
  ];
}
