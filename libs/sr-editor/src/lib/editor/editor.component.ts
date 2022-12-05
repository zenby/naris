import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY_WORKBOOK, TextBlock, WorkbookModel } from '../interfaces/document.model';

const BLOCKS_DELIMETER_REGEXP = /\n\n/;

@Component({
  selector: 'soer-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  @Input() document: WorkbookModel = EMPTY_WORKBOOK;
  @Output() save = new EventEmitter<WorkbookModel>();

  public previewFlag = false;
  public editIndex = -1;

  constructor(
    private cdp: ChangeDetectorRef,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params['action'] === 'save') {
        this.save.next(this.document);
      }
      if (params['action'] === 'add') {
        this.router.navigate([], { relativeTo: this.route, queryParams: {} });
        this.addBlockMarkdown(this.editIndex);
      }
      if (params['action'] === 'remove') {
        this.router.navigate([], { relativeTo: this.route, queryParams: {} });
        this.removeBlock(this.editIndex);
      }
      if (params['action'] === 'up') {
        this.router.navigate([], { relativeTo: this.route, queryParams: {} });
        this.move(this.editIndex, this.editIndex - 1);
      }
      if (params['action'] === 'down') {
        this.router.navigate([], { relativeTo: this.route, queryParams: {} });
        this.move(this.editIndex, this.editIndex + 1);
      }
      this.previewFlag = params['preview'] === 'true';
      this.cdp.markForCheck();
    });
  }

  setActive(activeBlock: number) {
    this.editIndex = activeBlock;
  }

  handleTextChange(changedText: string) {
    if (BLOCKS_DELIMETER_REGEXP.test(changedText)) {
      const blocksToInsert = changedText.split(BLOCKS_DELIMETER_REGEXP);
      this.insertBlocks(blocksToInsert);
    }
  }

  move(from: number, to: number): void {
    const blocks = this.document.blocks;
    const tmp: TextBlock = blocks[to];
    if (tmp) {
      blocks[to] = blocks[from];
      blocks[from] = tmp;
      this.editIndex = -1;
      setTimeout(() => {
        this.editIndex = to;
        this.cdp.detectChanges();
      }, 10);
    }
  }

  addBlockMarkdown(from: number): void {
    this.editIndex = from + 1;
    const left = this.document.blocks.slice(0, this.editIndex);
    const right = this.document.blocks.slice(this.editIndex);
    this.document.blocks = [...left, { text: '', type: 'markdown' }, ...right];
  }

  removeBlock(removeIndex: number): void {
    if (this.document.blocks.length === 1) return;

    this.document.blocks = this.document.blocks.filter((el, index) => removeIndex !== index);
    this.editIndex = this.editIndex - 1;
  }

  isBlockEditable(index: number): boolean {
    return index === this.editIndex;
  }

  onFolderUp() {
    this._location.back();
  }

  private insertBlocks(blocksToInsert: string[]) {
    const beforeInsertBlocks = this.document.blocks.slice(0, this.editIndex);
    const afterInsertBlocks = this.document.blocks.slice(this.editIndex + 1);
    const insertedBlocks = blocksToInsert.map((b: string) => ({ text: b.trim(), type: 'markdown' } as TextBlock));
    this.document.blocks = [...beforeInsertBlocks, ...insertedBlocks, ...afterInsertBlocks];
    this.editIndex = this.editIndex + blocksToInsert.length - 1;
  }
}
