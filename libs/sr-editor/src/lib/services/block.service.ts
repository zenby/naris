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

  private dispacthBlockStatesChangeEvent(): void {
    this.onBlockStatesChange.next(this.blockStates);
  }

  private isActive(blockIndex: number): boolean {
    return this.blockStates[blockIndex].isActive;
  }

  private isEditable(index: number): boolean {
    return this.blockStates[index].isEdit;
  }

  private markAsActive(blockIndex: number): void {
    const newBlockStates = this.blockStates.map((blockState) => ({
      ...blockState,
      isActive: false,
    }));
    newBlockStates[blockIndex].isActive = true;
    this.blockStates = newBlockStates;
  }

  private markAsEditable(blockIndex: number): void {
    this.blockStates[blockIndex].isEdit = true;
  }
}
