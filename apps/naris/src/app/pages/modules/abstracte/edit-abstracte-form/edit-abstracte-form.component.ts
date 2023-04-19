import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY_WORKBOOK, WorkbookModel } from '@soer/sr-editor';

@Component({
  selector: 'soer-edit-abstracte-form',
  templateUrl: './edit-abstracte-form.component.html',
  styleUrls: ['./edit-abstracte-form.component.scss'],
})
export class EditAbstracteFormComponent implements AfterViewInit {
  @Input() workbook: WorkbookModel = EMPTY_WORKBOOK;
  @Output() save = new EventEmitter<WorkbookModel>();
  public previewFlag = false;

  private prevWorkbook = '';

  constructor(
    private cdp: ChangeDetectorRef,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params['action'] === 'save') {
        this.save.next(this.workbook);

        this.prevWorkbook = JSON.stringify(this.workbook);
      }

      this.previewFlag = params['preview'] === 'true';
      this.cdp.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.prevWorkbook = JSON.stringify(this.workbook);
  }

  hasChanges() {
    return this.prevWorkbook != JSON.stringify(this.workbook);
  }

  onFolderUp() {
    this._location.back();
  }
}
