import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockService, WrappedBlock } from '../../services/block.service';
import { BlocksDocumentModel, EMPTY_DOCUMENT } from '../../interfaces/document.model';

@Component({
  selector: 'soer-editor',
  templateUrl: './editor.component.html',
})
export class EditorComponent implements OnInit {
  @Input() document: BlocksDocumentModel = EMPTY_DOCUMENT;
  @Output() save = new EventEmitter<BlocksDocumentModel>();

  public previewFlag = false;
  public activeIndex = -1;
  public blocksDelimiter = this.blockService.blocksDelimiter;
  public blocks: WrappedBlock[] = [];

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
    this.blockService.onBlocksChange.subscribe((blocks) => {
      this.blocks = [...blocks];
      this.document.blocks = this.blocks.map((block) => block.textBlock);
      cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.blockService.init(this.document.blocks);
  }

  onFolderUp() {
    this._location.back();
  }
}
