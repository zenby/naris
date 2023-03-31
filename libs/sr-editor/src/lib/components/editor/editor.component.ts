import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockService, BlockState } from '../../services/block.service';
import { EMPTY_WORKBOOK, WorkbookModel } from '../../interfaces/document.model';

@Component({
  selector: 'soer-editor',
  templateUrl: './editor.component.html',
})
export class EditorComponent implements OnInit {
  @Input() document: WorkbookModel = EMPTY_WORKBOOK;
  @Output() save = new EventEmitter<WorkbookModel>();

  public previewFlag = false;
  public activeIndex = -1;
  public blocksDelimiter = this.blockService.blocksDelimiter;
  public blockStates: BlockState[] = [];

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
      this.previewFlag = params['preview'] === 'true';
      this.cdr.markForCheck();
    });
    this.blockService.onBlockStatesChange.subscribe((blockStates) => {
      this.blockStates = [...blockStates];
      cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.blockService.init(this.document.blocks);
  }

  setActive(activeBlock: number) {
    this.blockService.setFocus(activeBlock);
  }

  saveFocused(blockIndex: number) {
    this.blockService.saveFocused(blockIndex);
  }

  move(from: number, to: number): void {
    this.blockService.move(from, to);
  }

  addBlockMarkdown(from: number): void {
    this.blockService.add(from);
  }

  removeBlock(removeIndex: number): void {
    this.blockService.remove(removeIndex);
  }

  onEndEdit(blockIndex: number) {
    this.blockService.stopEdit(blockIndex);
  }

  format(blockIndex: number): void {
    this.blockService.format(blockIndex);
  }

  onFolderUp() {
    this._location.back();
  }
}
