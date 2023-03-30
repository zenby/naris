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

  describe('setting focused block', () => {
    const blockIndex = 1;

    it('should mark block as focused and editing', async () => {
      service.setFocus(blockIndex);

      expect(blockStates[blockIndex].isFocused).toBeTruthy();
      expect(blockStates[blockIndex].isEdit).toBeTruthy();
    });

    it('should not be dispatched block change event because block is currently focused', async () => {
      service.setFocus(blockIndex);
      service.setFocus(blockIndex);

      expect(service.onBlockStatesChange.next).toBeCalledTimes(2); // 1-й -> инициализация, 2-й -> первая установка активного блока
    });
  });

  describe('move block', () => {
    const oldBlockPosition = 1;
    const newBlockPosition = 2;

    it('should move block', () => {
      service.move(oldBlockPosition, newBlockPosition);

      expect(blockStates[newBlockPosition].block.text).toBe(blocks[oldBlockPosition].text);
      expect(blockStates[oldBlockPosition].block.text).toBe(blocks[newBlockPosition].text);
    });

    it('should save focused after moving block', () => {
      service.setFocus(oldBlockPosition);
      service.move(oldBlockPosition, newBlockPosition);

      expect(blockStates[newBlockPosition].isFocused).toBeTruthy();
      expect(blockStates[oldBlockPosition].isFocused).toBeFalsy();
    });

    it('should save editable state after moving block', () => {
      service.setFocus(oldBlockPosition);
      service.move(oldBlockPosition, newBlockPosition);

      expect(blockStates[newBlockPosition].isEdit).toBeTruthy();
      expect(blockStates[oldBlockPosition].isEdit).toBeFalsy();
    });

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

      it('should set new block as focused', () => {
        expect(blockStates[newBlockIndex].isFocused).toBeTruthy();
      });
    });

    it('should save editing state for existing blocks after add', () => {
      service.setFocus(1);
      service.setFocus(3);

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

    it('should focus on the previous block', () => {
      service.setFocus(removeIndex - 1);

      service.remove(removeIndex);

      expect(blockStates[removeIndex - 1].isFocused).toBeTruthy();
    });

    it('should focus on the next block', () => {
      service.setFocus(removeIndex + 1);

      service.remove(removeIndex);

      expect(blockStates[removeIndex].isFocused).toBeTruthy();
    });

    it('should focus on the current focused block', () => {
      const currentFocusedBlock = 0;
      service.setFocus(removeIndex - 1);
      service.setFocus(currentFocusedBlock);

      service.remove(removeIndex);
      expect(blockStates[currentFocusedBlock].isFocused).toBeTruthy();
    });

    it('no block should be in focus', () => {
      service.remove(removeIndex);

      expect(blockStates.findIndex((blockState) => blockState.isFocused)).toBe(-1);
    });
  });

  describe('stop edit', () => {
    const blockIndex = 2;
    beforeEach(() => {
      service.setFocus(blockIndex);
    });

    it('block should not be in editing state after end of edition', () => {
      service.stopEdit(blockIndex);

      expect(blockStates[blockIndex].isEdit).toBeFalsy();
    });

    it('should focus on the previous block', () => {
      const focusedIndex = blockIndex - 1;
      service.setFocus(focusedIndex);
      service.setFocus(blockIndex);
      service.stopEdit(blockIndex);

      expect(blockStates[focusedIndex].isFocused).toBeTruthy();
    });

    it('should not focus on the previous block because currently focused block mismatch stopped editing block', () => {
      const focusedIndex = blockIndex + 1;
      service.setFocus(focusedIndex);
      service.setFocus(blockIndex);
      service.stopEdit(blockIndex);

      expect(blockStates[blockIndex - 1].isFocused).toBeFalsy();
      expect(blockStates[focusedIndex].isFocused).toBeTruthy();
    });

    it('should focus on the next block because it`s nearest', () => {
      service.setFocus(0);
      service.setFocus(blockIndex + 1);
      service.setFocus(blockIndex);

      service.stopEdit(blockIndex);

      expect(blockStates.findIndex((blockState) => blockState.isFocused)).toBe(3);
    });

    it('should not have focused block because no block editable', () => {
      service.stopEdit(blockIndex);

      expect(blockStates.findIndex((blockState) => blockState.isFocused)).toBe(-1);
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
