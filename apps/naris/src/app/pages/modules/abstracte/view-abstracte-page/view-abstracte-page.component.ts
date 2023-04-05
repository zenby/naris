import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusEmitter } from '@soer/mixed-bus';
import { DataStoreService, DtoPack } from '@soer/sr-dto';
import { WorkbookModel } from '@soer/sr-editor';
import { Observable } from 'node_modules/rxjs/dist/types';
import { parseJsonDTOPack } from '../../../../api/json.dto.helpers';
import { Location } from '@angular/common';

@Component({
  selector: 'soer-view-abstracte-page',
  templateUrl: './view-abstracte-page.component.html',
  styleUrls: ['./view-abstracte-page.component.scss'],
})
export class ViewAbstractePageComponent {
  public workbook$: Observable<DtoPack<WorkbookModel>>;
  private workbookId: BusEmitter;

  constructor(private store$: DataStoreService, private route: ActivatedRoute, private location: Location) {
    this.workbookId = this.route.snapshot.data['workbook'];
    this.workbook$ = parseJsonDTOPack<WorkbookModel>(this.store$.of(this.workbookId), 'workbook');

    this.route.queryParams.subscribe((params) => {
      if (params['action'] === 'save-as-pdf') {
        this.callPrint('.workbook-view');
        this.location.back();
      }
    });
  }

  callPrint(onElement: string) {
    const prtContent = document.querySelector(onElement);
    const WinPrint = window.open('', '', 'left=50,top=50,width=800,height=640,toolbar=0,scrollbars=1,status=0');

    if (prtContent && WinPrint) {
      WinPrint.document.write('<div id="print" class="contentpane">');
      WinPrint.document.write(prtContent.innerHTML);
      WinPrint.document.write('</div>');
      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    }
  }
}
