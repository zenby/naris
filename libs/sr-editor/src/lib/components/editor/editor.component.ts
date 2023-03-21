import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockService } from '../../services/block.service';
import { DelimitEvent, EMPTY_WORKBOOK, TextBlock, WorkbookModel } from '../../interfaces/document.model';

@Component({
  selector: 'soer-editor',
  templateUrl: './editor.component.html',
})
export class EditorComponent {
  @Input() document: WorkbookModel = EMPTY_WORKBOOK;
  @Output() save = new EventEmitter<WorkbookModel>();

  public previewFlag = false;
  public activeIndex = -1;
  public blocksDelimiter = this.blockService.blocksDelimiter;
  private editingState: { [key: number]: boolean } = {};

  constructor(
    private cdr: ChangeDetectorRef,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private blockService: BlockService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params['action'] === 'save') {
        this.save.next(this.document);
      }
      if (params['action'] === 'format') {
        this.router.navigate([], { relativeTo: this.route, queryParams: {} });
        this.delimitBLock(this.document.blocks[this.activeIndex]);
      }
      this.previewFlag = params['preview'] === 'true';
      this.cdr.markForCheck();
    });
  }

  setActive(activeBlock: number) {
    this.setActiveBlock(activeBlock);
    if (!this.isBlockEditable(activeBlock)) {
      this.startBlockEdit(activeBlock);
    }
  }

  move(from: number, to: number): void {
    const blocks = this.document.blocks;
    const tmp: TextBlock = blocks[to];
    if (tmp) {
      blocks[to] = blocks[from];
      blocks[from] = tmp;
      this.activeIndex = -1;
      setTimeout(() => {
        if (!this.isBlockEditable(to)) {
          this.stopBlockEdit(from);
          this.startBlockEdit(to);
        }

        this.activeIndex = to;
        this.cdr.detectChanges();
      }, 10);
    }
  }

  addBlockMarkdown(from: number): void {
    const newBlockIndex = from + 1;
    const left = this.document.blocks.slice(0, newBlockIndex);
    const right = this.document.blocks.slice(newBlockIndex);
    this.document.blocks = [...left, { text: '', type: 'markdown' }, ...right];
    this.saveEditStateForSubsequentBlocksWhenInsertingBlock(from, right);
    this.startBlockEdit(newBlockIndex);
    this.setActiveBlock(newBlockIndex);
  }

  removeBlock(removeIndex: number): void {
    if (this.document.blocks.length === 1) return;

    const nearestEditedBlock = this.findNearestEditedBlock(removeIndex);
    this.saveEditStateForSubsequentBlocksWhenDeletingBlock(removeIndex + 1, this.document.blocks.slice(removeIndex));
    this.document.blocks = this.document.blocks.filter((el, index) => removeIndex !== index);
    this.setActiveBlock(nearestEditedBlock > removeIndex ? nearestEditedBlock - 1 : nearestEditedBlock);
  }

  onEndEdit(blockIndex: number) {
    this.stopBlockEdit(blockIndex);
    if (this.isBlockActive(blockIndex)) {
      this.setActiveBlock(this.findNearestEditedBlock(blockIndex));
    }
  }

  isBlockEditable(index: number): boolean {
    return this.editingState[index] ?? false;
  }

  isBlockActive(index: number) {
    return this.activeIndex === index;
  }

  onFolderUp() {
    this._location.back();
  }

  delimitBLock(delimitData: DelimitEvent) {
    const { blocks, activeBlockIndex } = this.blockService.delimitBlock(
      delimitData,
      this.document.blocks,
      this.activeIndex
    );
    this.document.blocks = blocks;
    this.setActiveBlock(activeBlockIndex);
  }

  private setActiveBlock(blockIndex: number): void {
    this.activeIndex = blockIndex;
    this.cdr.markForCheck();
  }

  private saveEditStateForSubsequentBlocksWhenInsertingBlock(insertIndex: number, subsequentBlocks: TextBlock[]): void {
    let index = subsequentBlocks.length;
    while (index > 0) {
      this.saveBlockEditState(insertIndex + index, insertIndex + index + 1);
      index--;
    }
  }

  private saveEditStateForSubsequentBlocksWhenDeletingBlock(deleteIndex: number, subsequentBlocks: TextBlock[]): void {
    subsequentBlocks.forEach((block, blockIndex) => {
      this.saveBlockEditState(deleteIndex + blockIndex, deleteIndex + blockIndex - 1);
    });
  }

  private saveBlockEditState(oldIndex: number, newIndex: number) {
    if (this.isBlockEditable(oldIndex)) {
      this.startBlockEdit(newIndex);
    } else {
      this.stopBlockEdit(newIndex);
    }
  }

  private findNearestEditedBlock(blockIndex: number): number {
    let index = 1;
    while (index <= this.document.blocks.length) {
      const upBlockIndex = blockIndex - index;
      const downBlockIndex = blockIndex + index;
      if (this.isBlockEditable(upBlockIndex)) {
        return upBlockIndex;
      } else if (this.isBlockEditable(downBlockIndex)) {
        return downBlockIndex;
      }
      index++;
    }

    return -1;
  }

  private stopBlockEdit(blockIndex: number): void {
    this.editingState[blockIndex] = false;
  }

  private startBlockEdit(blockIndex: number): void {
    this.editingState[blockIndex] = true;
  }
}
