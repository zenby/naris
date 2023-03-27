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

  public init(blocks: TextBlock[]) {
    this.blockStates = blocks.map((block) => ({
      block,
      isActive: false,
      isEdit: false,
    }));

    this.dispacthBlockStatesChangeEvent();
  }

  private dispacthBlockStatesChangeEvent() {
    this.onBlockStatesChange.next(this.blockStates);
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
}
