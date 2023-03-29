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

  describe('add block', () => {
    it('should add block', () => {
      const counOfblock = blockStates.length;

      service.add(0);

      expect(blockStates.length).toBe(counOfblock + 1);
    });

    describe('check new block state', () => {
      const newBlockIndex = 1;
      beforeEach(() => {
        service.add(newBlockIndex);
      });

      it('should set new block in editing state', () => {
        expect(blockStates[newBlockIndex].isEdit).toBeTruthy();
      });

      it('should set new block as active block', () => {
        expect(blockStates[newBlockIndex].isActive).toBeTruthy();
      });
    });

    it('should save editing state for existing blocks after add', () => {
      service.setActive(1);
      service.setActive(3);

      service.add(0);

      expect(blockStates[1].isEdit).toBeFalsy();
      expect(blockStates[2].isEdit).toBeTruthy();
      expect(blockStates[3].isEdit).toBeFalsy();
      expect(blockStates[4].isEdit).toBeTruthy();
    });
  });

  describe('remove block', () => {
    const removeIndex = 2;

    it('should remove block', () => {
      const counOfblock = blockStates.length;

      service.remove(removeIndex);

      expect(blockStates.length).toBe(counOfblock - 1);
    });

    it('active index should be on the previous block', () => {
      service.setActive(removeIndex - 1);

      service.remove(removeIndex);

      expect(blockStates[removeIndex - 1].isActive).toBeTruthy();
    });

    it('active index should be on the next block', () => {
      service.setActive(removeIndex + 1);

      service.remove(removeIndex);

      expect(blockStates[removeIndex].isActive).toBeTruthy();
    });

    it('active index should be on the current active block', () => {
      const currentActiveBlock = 0;
      service.setActive(removeIndex - 1);
      service.setActive(currentActiveBlock);

      service.remove(removeIndex);
      expect(blockStates[currentActiveBlock].isActive).toBeTruthy();
    });

    it('no block should be active', () => {
      service.remove(removeIndex);

      expect(blockStates.findIndex((blockState) => blockState.isActive)).toBe(-1);
    });

    it('block index should be removed from edit state', () => {
      service.remove(removeIndex);

      expect(blockStates[removeIndex].isEdit).toBe(false);
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
