import { EventEmitter, Injectable } from '@angular/core';
import { TextBlock } from '../interfaces/document.model';

export type BlockState = {
  [id: string]: {
    isFocused: boolean;
    isEdit: boolean;
  };
};

export type BlockWrapper = {
  id: string;
  block: TextBlock;
};

@Injectable()
export class BlockService {
  public readonly blocksDelimiter = '\n\n\n';
  public onBlocksChange = new EventEmitter<BlockWrapper[]>();
  public onBlocksStateChange = new EventEmitter<BlockState>();

  private blockState: BlockState = {};
  private blocks: BlockWrapper[] = [];

  init(blocks: TextBlock[]): void {
    this.blocks = [];
    blocks.forEach((block) => {
      const id = this.generateId();
      this.blocks.push({
        id,
        block,
      });

      this.blockState[id] = {
        isFocused: false,
        isEdit: false,
      };
    });

    this.dispatchBlocksChangeEvent();
  }

  format(blockId: string): void {
    const blockIndex = this.getCurrentPostion(blockId);
    const beforeBlocksToInsert = this.blocks.slice(0, blockIndex);
    const afterBlocksToInsert = this.blocks.slice(blockIndex + 1);
    const formatedBlock = this.blocks[blockIndex].block;
    const textBlocksToInsert = this.blocks[blockIndex].block.text.split(this.blocksDelimiter);

    const blocksToInsert: BlockWrapper[] = [];
    this.resetFocus();
    textBlocksToInsert.forEach((b: string, index: number) => {
      const id = this.generateId();
      blocksToInsert.push({
        id,
        block: { text: b.trim(), type: formatedBlock.type },
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
    if (!this.isFocused(blockId)) {
      this.markAsFocused(blockId);
      if (!this.isEditable(blockId)) {
        this.markAsEditable(blockId);
      }

      this.dispatchBlockStatesChangeEvent();
    }
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
    this.move(this.getCurrentPostion(blockId), this.getPreviousIndex(blockId));
  }

  moveDown(blockId: string): void {
    this.move(this.getCurrentPostion(blockId), this.getNextIndex(blockId));
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
        block: { text: '', type: 'markdown' },
        id: newBlockId,
      },
      ...right,
    ];

    this.dispatchBlocksChangeEvent();

    this.markAsFocused(newBlockId);
    this.delayedDispatchBlockStatesChangeEvent();
  }

  remove(blockId: string): void {
    if (this.blocks.length === 1) return;

    this.markAsUneditable(blockId);
    const newFocusedBlock = this.isFocused(blockId) ? this.findNearestEditedBlock(blockId) : false;
    const blockIndex = this.getCurrentPostion(blockId);
    this.blocks = this.blocks.filter((el, index) => blockIndex !== index);
    if (newFocusedBlock !== false) {
      this.markAsFocused(newFocusedBlock);
    }

    this.delayedDispatchBlockStatesChangeEvent();
    this.dispatchBlocksChangeEvent();
  }

  stopEdit(blockId: string): void {
    this.markAsUneditable(blockId);
    if (this.isFocused(blockId)) {
      this.resetFocus();
      const nearestEditedBlock = this.findNearestEditedBlock(blockId);
      if (nearestEditedBlock !== false) {
        this.markAsFocused(nearestEditedBlock);
      }
    }

    this.dispatchBlockStatesChangeEvent();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  private getPreviousIndex(blockId: string): number {
    return this.getCurrentPostion(blockId) - 1;
  }

  private getNextIndex(blockId: string): number {
    return this.getCurrentPostion(blockId) + 1;
  }

  private getCurrentPostion(blockId: string) {
    return this.blocks.findIndex((block) => block.id == blockId);
  }

  private move(oldBlockPosition: number, newBlockPosition: number): void {
    const currentBlocks = this.blocks;
    const tmp: BlockWrapper = currentBlocks[newBlockPosition];
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
    }, 100);
  }

  private dispatchBlockStatesChangeEvent(): void {
    this.onBlocksStateChange.next(this.blockState);
  }

  private isFocused(blockId: string): boolean {
    return this.blockState[blockId]?.isFocused;
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
    Object.keys(this.blockState).map((blockId) => {
      this.blockState[blockId].isFocused = false;
    });
  }

  private markAsEditable(blockId: string): void {
    this.blockState[blockId].isEdit = true;
  }

  private markAsUneditable(blockId: string): void {
    this.blockState[blockId].isEdit = false;
  }

  private findNearestEditedBlock(blockId: string): string | false {
    let index = 1;
    const blockIndex = this.getCurrentPostion(blockId);
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

    return false;
  }
}
