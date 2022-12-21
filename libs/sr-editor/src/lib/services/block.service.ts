import { Injectable } from '@angular/core';
import { DelimitEvent, TextBlock } from '../interfaces/document.model';

@Injectable()
export class BlockService {
  public readonly blocksDelimiter = '\n\n\n';

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
