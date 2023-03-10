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
  public editIndexes: number[] = [];
  public blocksDelimiter = this.blockService.blocksDelimiter;

  constructor(
    private cdp: ChangeDetectorRef,
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
      if (params['action'] === 'add') {
        this.router.navigate([], { relativeTo: this.route, queryParams: {} });
        this.addBlockMarkdown(this.activeIndex);
      }
      if (params['action'] === 'remove') {
        this.router.navigate([], { relativeTo: this.route, queryParams: {} });
        this.removeBlock(this.activeIndex);
      }
      if (params['action'] === 'up') {
        this.router.navigate([], { relativeTo: this.route, queryParams: {} });
        this.move(this.activeIndex, this.activeIndex - 1);
      }
      if (params['action'] === 'down') {
        this.router.navigate([], { relativeTo: this.route, queryParams: {} });
        this.move(this.activeIndex, this.activeIndex + 1);
      }
      this.previewFlag = params['preview'] === 'true';
      this.cdp.markForCheck();
    });
  }

  setActive(activeBlock: number) {
    this.activeIndex = activeBlock;
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
        this.activeIndex = to;
        this.cdp.detectChanges();
      }, 10);
    }
  }

  addBlockMarkdown(from: number): void {
    const newBlockIndex = from + 1;
    const left = this.document.blocks.slice(0, newBlockIndex);
    const right = this.document.blocks.slice(newBlockIndex);
    this.document.blocks = [...left, { text: '', type: 'markdown' }, ...right];
    this.startBlockEdit(newBlockIndex);
    this.activeIndex = newBlockIndex;
  }

  removeBlock(removeIndex: number): void {
    if (this.document.blocks.length === 1) return;

    this.document.blocks = this.document.blocks.filter((el, index) => removeIndex !== index);
    this.stopBlockEdit(removeIndex);
    this.activeIndex = this.activeIndex - 1;
  }

  onEndEdit(blockIndex: number) {
    this.stopBlockEdit(blockIndex);

    if (this.editIndexes.length) {
      this.activeIndex = this.editIndexes[blockIndex] || this.editIndexes[blockIndex - 1]
    }
  }

  isBlockEditable(index: number): boolean {
    return this.editIndexes.includes(index);
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
    this.activeIndex = activeBlockIndex;
  }

  private stopBlockEdit(blockIndex: number): void {
    this.editIndexes = this.editIndexes.filter((index) => blockIndex !== index);
  }

  private startBlockEdit(blockIndex: number): void {
    this.editIndexes.push(blockIndex);
  }
}
