import { faker } from '@faker-js/faker';
import { TextBlock } from '../interfaces/document.model';
import { BlockService, BlockState } from './block.service';

describe('BlockService', () => {
  let service: BlockService;
  let blocks: TextBlock[];

  beforeEach(() => {
    service = new BlockService();
    jest.spyOn(service.onBlockStatesChange, 'next');
    blocks = createFakeTextBlocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('init', () => {
    it('should dispatch block states', () => {
      service.init(blocks);

      expect(service.onBlockStatesChange.next).toBeCalled();
    });
  });

  describe('setActive', () => {
    const blockIndex = 1;
    let blockStates: BlockState[] = [];

    beforeEach(() => {
      service.init(blocks);
      blockStates = [];
      service.onBlockStatesChange.subscribe((newBlockStates) => (blockStates = newBlockStates));
    });

    it('should set block in active and editing state', async () => {
      service.setActive(blockIndex);

      expect(blockStates[blockIndex].isActive).toBeTruthy();
      expect(blockStates[blockIndex].isEdit).toBeTruthy();
    });

    it('should not be dispatched block change event because block is currently active', async () => {
      service.setActive(blockIndex);
      service.setActive(blockIndex);

      expect(service.onBlockStatesChange.next).toBeCalledTimes(2); // 1-й -> инициализация, 2-й -> первая установка активного блока
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
