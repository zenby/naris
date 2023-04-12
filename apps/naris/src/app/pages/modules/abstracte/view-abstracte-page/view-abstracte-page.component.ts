import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusEmitter } from '@soer/mixed-bus';
import { DataStoreService, DtoPack } from '@soer/sr-dto';
import { WorkbookModel } from '@soer/sr-editor';
import { Observable } from 'node_modules/rxjs/dist/types';
import { parseJsonDTOPack } from '../../../../api/json.dto.helpers';
import { Location } from '@angular/common';
import { printHTML } from '../abstracte.helper';

@Component({
  selector: 'soer-view-abstracte-page',
  templateUrl: './view-abstracte-page.component.html',
  styleUrls: ['./view-abstracte-page.component.scss'],
})
export class ViewAbstractePageComponent {
  public workbook$: Observable<DtoPack<WorkbookModel>>;
  private workbookId: BusEmitter;

  @ViewChild('workbook') workbookElement!: ElementRef;

  constructor(private store$: DataStoreService, private route: ActivatedRoute, private location: Location) {
    this.workbookId = this.route.snapshot.data['workbook'];
    this.workbook$ = parseJsonDTOPack<WorkbookModel>(this.store$.of(this.workbookId), 'workbook');

    this.route.queryParams.subscribe((params) => {
      if (params['action'] === 'save-as-pdf') {
        printHTML(this.workbookElement.nativeElement.innerHTML);
        this.location.back();
      }
    });
  }
}
