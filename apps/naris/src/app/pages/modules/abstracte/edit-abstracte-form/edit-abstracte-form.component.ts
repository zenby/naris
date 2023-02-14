import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY_WORKBOOK, WorkbookModel } from '@soer/sr-editor';

@Component({
  selector: 'soer-edit-abstracte-form',
  templateUrl: './edit-abstracte-form.component.html',
  styleUrls: ['./edit-abstracte-form.component.scss'],
})
export class EditAbstracteFormComponent {
  @Input() workbook: WorkbookModel = EMPTY_WORKBOOK;
  @Output() save = new EventEmitter<WorkbookModel>();
  public previewFlag = false;

  constructor(
    private cdp: ChangeDetectorRef,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params['action'] === 'save') {
        this.save.next(this.workbook);
      }

      this.previewFlag = params['preview'] === 'true';
      this.cdp.markForCheck();
    });
  }

  onFolderUp() {
    this._location.back();
  }
}
