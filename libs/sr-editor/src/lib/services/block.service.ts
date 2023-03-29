import { EventEmitter, Injectable } from '@angular/core';
import { DelimitEvent, TextBlock } from '../interfaces/document.model';

export type BlockState = {
  block: TextBlock;
  isActive: boolean;
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
      isActive: false,
      isEdit: false,
    }));

    this.dispacthBlockStatesChangeEvent();
  }

  delimitBlock(
    delimitData: DelimitEvent,
    blocks: TextBlock[],
    activeBlockIndex: number
  ): { blocks: TextBlock[]; activeBlockIndex: number } {
    const beforeBlocksToInsert = blocks.slice(0, activeBlockIndex);
    const afterBlocksToInsert = blocks.slice(activeBlockIndex + 1);
    const textBlocksToInsert = delimitData.text.split(this.blocksDelimiter);
    const blocksToInsert = textBlocksToInsert.map((b: string) => ({ text: b.trim(), type: delimitData.type }));

    return {
      blocks: [...beforeBlocksToInsert, ...blocksToInsert, ...afterBlocksToInsert],
      activeBlockIndex: activeBlockIndex + textBlocksToInsert.length - 1,
    };
  }

  setActive(blockIndex: number): void {
    if (!this.isActive(blockIndex)) {
      this.markAsActive(blockIndex);
      if (!this.isEditable(blockIndex)) {
        this.markAsEditable(blockIndex);
      }

      this.dispacthBlockStatesChangeEvent();
    }
  }

  move(from: number, to: number): void {
    const currentBlockStates = this.blockStates;
    const tmp: BlockState = currentBlockStates[to];
    if (tmp) {
      currentBlockStates[to] = currentBlockStates[from];
      currentBlockStates[from] = tmp;

      this.dispacthBlockStatesChangeEvent();
    }
  }

  add(newBlockIndex: number): void {
    const left = this.blockStates.slice(0, newBlockIndex);
    const right = this.blockStates.slice(newBlockIndex);
    this.blockStates = [
      ...left,
      {
        block: { text: '', type: 'markdown' },
        isActive: true,
        isEdit: true,
      },
      ...right,
    ];

    this.dispacthBlockStatesChangeEvent();
  }

  remove(blockIndex: number): void {
    if (this.blockStates.length === 1) return;

    const newActiveBlock = this.isActive(blockIndex) ? this.findNearestEditedBlock(blockIndex) : false;
    this.blockStates = this.blockStates.filter((el, index) => blockIndex !== index);
    if (newActiveBlock !== false) {
      this.markAsActive(newActiveBlock > blockIndex ? newActiveBlock - 1 : newActiveBlock);
    }

    this.dispacthBlockStatesChangeEvent();
  }

  stopEdit(blockIndex: number): void {
    this.markAsUneditable(blockIndex);
    if (this.isActive(blockIndex)) {
      this.resetActive();
      const nearestEditedBlock = this.findNearestEditedBlock(blockIndex);
      if (nearestEditedBlock !== false) {
        this.markAsActive(nearestEditedBlock);
      }
    }

    this.dispacthBlockStatesChangeEvent();
  }

  private dispacthBlockStatesChangeEvent(): void {
    this.onBlockStatesChange.next(this.blockStates);
  }

  private isActive(blockIndex: number): boolean {
    return this.blockStates[blockIndex]?.isActive;
  }

  private isEditable(index: number): boolean {
    return this.blockStates[index]?.isEdit;
  }

  private markAsActive(blockIndex: number): void {
    this.resetActive();
    this.blockStates[blockIndex].isActive = true;
  }

  private resetActive() {
    this.blockStates = this.blockStates.map((blockState) => ({
      ...blockState,
      isActive: false,
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
