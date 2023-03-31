import { EventEmitter, Injectable } from '@angular/core';
import { TextBlock } from '../interfaces/document.model';

export type BlockState = {
  block: TextBlock;
  isFocused: boolean;
  isEdit: boolean;
};

@Injectable()
export class BlockService {
  public readonly blocksDelimiter = '\n\n\n';
  public onBlockStatesChange = new EventEmitter<BlockState[]>();

  private blockStates: BlockState[] = [];

  init(blocks: TextBlock[]): void {
    this.blockStates = blocks.map((block) => ({
      block,
      isFocused: false,
      isEdit: false,
    }));

    this.dispacthBlockStatesChangeEvent();
  }

  format(blockIndex: number): void {
    const beforeBlocksToInsert = this.blockStates.slice(0, blockIndex);
    const afterBlocksToInsert = this.blockStates.slice(blockIndex + 1);
    const formatedBlock = this.blockStates[blockIndex].block;
    const textBlocksToInsert = this.blockStates[blockIndex].block.text.split(this.blocksDelimiter);
    const blocksToInsert = textBlocksToInsert.map((b: string) => ({
      block: { text: b.trim(), type: formatedBlock.type },
      isFocused: false,
      isEdit: false,
    }));

    this.blockStates = [...beforeBlocksToInsert, ...blocksToInsert, ...afterBlocksToInsert];

    this.dispacthBlockStatesChangeEvent();
  }

  setFocus(blockIndex: number): void {
    if (!this.isFocused(blockIndex)) {
      this.markAsFocused(blockIndex);
      if (!this.isEditable(blockIndex)) {
        this.markAsEditable(blockIndex);
      }

      this.dispacthBlockStatesChangeEvent();
    }
  }

  saveFocused(blockIndex: number): void {
    this.markAsFocused(blockIndex);
    this.markAsEditable(blockIndex);
  }

  move(oldBlockPosition: number, newBlockPosition: number): void {
    const currentBlockStates = this.blockStates;
    const tmp: BlockState = currentBlockStates[newBlockPosition];
    if (tmp) {
      currentBlockStates[newBlockPosition] = currentBlockStates[oldBlockPosition];
      currentBlockStates[oldBlockPosition] = tmp;

      this.dispacthBlockStatesChangeEvent();
    }
  }

  add(newBlockIndex: number): void {
    const left = this.blockStates.slice(0, newBlockIndex);
    const right = this.blockStates.slice(newBlockIndex);
    this.resetFocus();
    this.blockStates = [
      ...left,
      {
        block: { text: '', type: 'markdown' },
        isFocused: true,
        isEdit: true,
      },
      ...right,
    ];

    this.dispacthBlockStatesChangeEvent();
  }

  remove(blockIndex: number): void {
    if (this.blockStates.length === 1) return;

    const newFocusedBlock = this.isFocused(blockIndex) ? this.findNearestEditedBlock(blockIndex) : false;
    this.blockStates = this.blockStates.filter((el, index) => blockIndex !== index);
    if (newFocusedBlock !== false) {
      this.setFocus(newFocusedBlock > blockIndex ? newFocusedBlock - 1 : newFocusedBlock);
    }

    this.dispacthBlockStatesChangeEvent();
  }

  stopEdit(blockIndex: number): void {
    this.markAsUneditable(blockIndex);
    if (this.isFocused(blockIndex)) {
      this.resetFocus();
      const nearestEditedBlock = this.findNearestEditedBlock(blockIndex);
      if (nearestEditedBlock !== false) {
        this.setFocus(nearestEditedBlock);
      }
    }

    this.dispacthBlockStatesChangeEvent();
  }

  private dispacthBlockStatesChangeEvent(): void {
    this.onBlockStatesChange.next(this.blockStates);
  }

  private isFocused(blockIndex: number): boolean {
    return this.blockStates[blockIndex]?.isFocused;
  }

  private isEditable(blockIndex: number): boolean {
    return this.blockStates[blockIndex]?.isEdit;
  }

  private markAsFocused(blockIndex: number): void {
    this.resetFocus();
    this.blockStates[blockIndex].isFocused = true;
  }

  private resetFocus(): void {
    this.blockStates = this.blockStates.map((blockState) => ({
      ...blockState,
      isFocused: false,
    }));
  }

  private markAsEditable(blockIndex: number): void {
    this.blockStates[blockIndex].isEdit = true;
  }

  private markAsUneditable(blockIndex: number): void {
    this.blockStates[blockIndex].isEdit = false;
  }

  private findNearestEditedBlock(blockIndex: number): number | false {
    let index = 1;
    while (index <= this.blockStates.length) {
      const upBlockIndex = blockIndex - index;
      const downBlockIndex = blockIndex + index;
      if (this.isEditable(upBlockIndex)) {
        return upBlockIndex;
      } else if (this.isEditable(downBlockIndex)) {
        return downBlockIndex;
      }
      index++;
    }

    return false;
  }
}
