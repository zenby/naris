import { faker } from '@faker-js/faker';
import { TextBlock } from '../interfaces/document.model';
import { BlockService, BlockState } from './block.service';

describe('BlockService', () => {
  let service: BlockService;
  let blocks: TextBlock[] = [];
  let blockStates: BlockState[] = [];

  beforeEach(() => {
    service = new BlockService();
    jest.spyOn(service.onBlockStatesChange, 'next');
    service.onBlockStatesChange.subscribe((newBlockStates) => (blockStates = newBlockStates));
    blocks = createFakeTextBlocks();
    service.init(blocks);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('init', () => {
    it('should dispatch block states', () => {
      expect(service.onBlockStatesChange.next).toBeCalled();
    });
  });

  describe('setting active block', () => {
    const blockIndex = 1;

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

  describe('move', () => {
    const oldBlockPosition = 1;
    const newBlockPosition = 2;

    it('should move block', () => {
      service.move(oldBlockPosition, newBlockPosition);

      expect(blockStates[newBlockPosition].block.text).toBe(blocks[oldBlockPosition].text);
      expect(blockStates[oldBlockPosition].block.text).toBe(blocks[newBlockPosition].text);
    });

    it('should save active state after moving block', () => {
      service.setActive(oldBlockPosition);
      service.move(oldBlockPosition, newBlockPosition);

      expect(blockStates[newBlockPosition].isActive).toBeTruthy();
      expect(blockStates[oldBlockPosition].isActive).toBeFalsy();
    });

    it.todo('should save editable state after moving block');

    it('should not dispatched block change event because block position which need to move block is out of range', () => {
      service.move(oldBlockPosition, -1);

      expect(service.onBlockStatesChange.next).toBeCalledTimes(1);
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
