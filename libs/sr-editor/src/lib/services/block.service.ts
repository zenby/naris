import { EventEmitter, Injectable } from '@angular/core';
import { TextBlock } from '../interfaces/document.model';

export type BlockState = {
  [id: string]: {
    isFocused: boolean;
    isEdit: boolean;
  };
};

export type WrappedBlock = {
  id: string;
  textBlock: TextBlock;
};

@Injectable()
export class BlockService {
  public readonly blocksDelimiter = '\n\n\n';
  public onBlocksChange = new EventEmitter<WrappedBlock[]>();
  public onBlocksStateChange = new EventEmitter<BlockState>();

  private blockState: BlockState = {};
  private blocks: WrappedBlock[] = [];

  init(blocks: TextBlock[]): void {
    this.blocks = [];
    blocks.forEach((block) => {
      const id = this.generateId();
      this.blocks.push({
        id,
        textBlock: block,
      });

      this.blockState[id] = {
        isFocused: false,
        isEdit: false,
      };
    });

    this.dispatchBlocksChangeEvent();
  }

  format(blockId: string): void {
    const blockIndex = this.getCurrentPosition(blockId);
    const beforeBlocksToInsert = this.blocks.slice(0, blockIndex);
    const afterBlocksToInsert = this.blocks.slice(blockIndex + 1);
    const formatedBlock = this.blocks[blockIndex].textBlock;
    const textBlocksToInsert = this.blocks[blockIndex].textBlock.text.split(this.blocksDelimiter);

    const blocksToInsert: WrappedBlock[] = [];
    this.resetFocus();
    textBlocksToInsert.forEach((b: string, index: number) => {
      const id = this.generateId();
      blocksToInsert.push({
        id,
        textBlock: { text: b.trim(), type: formatedBlock.type },
      });

      this.blockState[id] = {
        isEdit: index == 0,
        isFocused: index == 0,
      };
    });

    this.blocks = [...beforeBlocksToInsert, ...blocksToInsert, ...afterBlocksToInsert];

    this.dispatchBlocksChangeEvent();
    this.delayedDispatchBlockStatesChangeEvent();
  }

  saveFocused(blockId: string): void {
    this.resetFocus();
    delete this.blockState[blockId];
    this.dispatchBlockStatesChangeEvent();
    this.markAsFocused(blockId);
  }

  setFocus(blockId: string): void {
    this.markAsFocused(blockId);
    if (!this.isEditable(blockId)) {
      this.markAsEditable(blockId);
    }

    this.delayedDispatchBlockStatesChangeEvent();
  }

  setFocusOnPrevious(blockId: string): void {
    const previousIndex = this.getPreviousIndex(blockId);
    if (this.blocks[previousIndex]) {
      this.setFocus(this.blocks[previousIndex].id);
    }
  }

  setFocusOnNext(blockId: string): void {
    const nextIndex = this.getNextIndex(blockId);
    if (this.blocks[nextIndex]) {
      this.setFocus(this.blocks[nextIndex].id);
    }
  }

  moveUp(blockId: string): void {
    this.move(this.getCurrentPosition(blockId), this.getPreviousIndex(blockId));
  }

  moveDown(blockId: string): void {
    this.move(this.getCurrentPosition(blockId), this.getNextIndex(blockId));
  }

  addAfter(blockId: string): void {
    const newBlockIndex = this.getNextIndex(blockId);
    const left = this.blocks.slice(0, newBlockIndex);
    const right = this.blocks.slice(newBlockIndex);
    this.resetFocus();
    const newBlockId = this.generateId();
    this.blocks = [
      ...left,
      {
        textBlock: { text: '', type: 'markdown' },
        id: newBlockId,
      },
      ...right,
    ];

    this.dispatchBlocksChangeEvent();

    this.markAsFocused(newBlockId);
    this.delayedDispatchBlockStatesChangeEvent();
  }

  remove(blockId: string): void {
    const isBlockCanBeRemoved = this.isBlockCanBeRemoved(blockId);
    if (!isBlockCanBeRemoved) return;

    this.markAsUneditable(blockId);
    const newFocusedBlock = this.findNearestEditingBlock(blockId);
    const blockIndex = this.getCurrentPosition(blockId);
    this.blocks = this.blocks.filter((_, index) => blockIndex !== index);
    if (newFocusedBlock) {
      this.markAsFocused(newFocusedBlock);
    }

    this.delayedDispatchBlockStatesChangeEvent();
    this.dispatchBlocksChangeEvent();
  }

  stopEdit(blockId: string): void {
    this.markAsUneditable(blockId);
    this.resetFocus();
    const nearestEditedBlock = this.findNearestEditingBlock(blockId);
    if (nearestEditedBlock) {
      this.markAsFocused(nearestEditedBlock);
    }

    this.dispatchBlockStatesChangeEvent();
  }

  setBlockText(blockId: string, text: string): void {
    const blockIndex = this.getCurrentPosition(blockId);
    this.blocks[blockIndex].textBlock.text = text;
    this.dispatchBlockStatesChangeEvent();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  private getPreviousIndex(blockId: string): number {
    return this.getCurrentPosition(blockId) - 1;
  }

  private getNextIndex(blockId: string): number {
    return this.getCurrentPosition(blockId) + 1;
  }

  private getCurrentPosition(blockId: string) {
    return this.blocks.findIndex((block) => block.id == blockId);
  }

  private move(oldBlockPosition: number, newBlockPosition: number): void {
    const currentBlocks = this.blocks;
    const tmp: WrappedBlock = currentBlocks[newBlockPosition];
    if (tmp) {
      currentBlocks[newBlockPosition] = currentBlocks[oldBlockPosition];
      currentBlocks[oldBlockPosition] = tmp;

      this.dispatchBlocksChangeEvent();
      this.delayedDispatchBlockStatesChangeEvent();
    }
  }

  private dispatchBlocksChangeEvent(): void {
    this.onBlocksChange.next(this.blocks);
  }

  private delayedDispatchBlockStatesChangeEvent(): void {
    setTimeout(() => {
      this.dispatchBlockStatesChangeEvent();
    }, 10);
  }

  private dispatchBlockStatesChangeEvent(): void {
    this.onBlocksStateChange.next(this.blockState);
  }

  private isEditable(blockId: string): boolean {
    return this.blockState[blockId]?.isEdit;
  }

  private markAsFocused(blockId: string): void {
    this.resetFocus();
    if (this.blockState[blockId]) {
      this.blockState[blockId].isFocused = true;
    } else {
      this.blockState[blockId] = {
        isFocused: true,
        isEdit: true,
      };
    }
  }

  private resetFocus(): void {
    Object.keys(this.blockState).forEach((blockId) => {
      this.blockState[blockId].isFocused = false;
    });
  }

  private markAsEditable(blockId: string): void {
    this.blockState[blockId].isEdit = true;
  }

  private markAsUneditable(blockId: string): void {
    this.blockState[blockId].isEdit = false;
  }

  private findNearestEditingBlock(blockId: string): string | null {
    let index = 1;
    const blockIndex = this.getCurrentPosition(blockId);
    while (index <= this.blocks.length) {
      const upBlockIndex = blockIndex - index;
      const downBlockIndex = blockIndex + index;
      if (this.isEditable(this.blocks[upBlockIndex]?.id)) {
        return this.blocks[upBlockIndex].id;
      } else if (this.isEditable(this.blocks[downBlockIndex]?.id)) {
        return this.blocks[downBlockIndex].id;
      }
      index++;
    }

    return null;
  }

  private isBlockCanBeRemoved(blockId: string): boolean {
    const blockToRemove = this.blocks.find(({ id }) => id === blockId);
    if (this.blocks.length === 1 || !blockToRemove) {
      return false;
    }

    const MAX_TEXT_LENGTH_TO_ASK_REMOVE = 20;
    if (blockToRemove.textBlock.text.length > MAX_TEXT_LENGTH_TO_ASK_REMOVE) {
      return window.confirm('Вы точно хотите удалить текущий блок?');
    }

    return true;
  }
}
