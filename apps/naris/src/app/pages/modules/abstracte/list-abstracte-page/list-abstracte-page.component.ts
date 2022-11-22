import { PreloaderService } from './../../../../services/preloader.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusEmitter, MixedBusService } from '@soer/mixed-bus';
import { CommandDelete, CommandEdit, CommandNew, CommandView, DataStoreService, DtoPack } from '@soer/sr-dto';
import { WorkbookModel } from '@soer/sr-editor';
import { Observable, finalize } from 'rxjs';
import { parseJsonDTOPack } from '../../../../api/json.dto.helpers';


@Component({
  selector: 'soer-list-abstracte-page',
  templateUrl: './list-abstracte-page.component.html',
  styleUrls: ['./list-abstracte-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListAbstractePageComponent implements OnInit {

  public name? = '';

  private workbooksId: BusEmitter;
  private workbookId: BusEmitter;

  public workbook$!: Observable<DtoPack<WorkbookModel>>;

  constructor(
    private bus$: MixedBusService,
    private store$: DataStoreService,
    private route: ActivatedRoute,
    private preloaderService: PreloaderService,
  ) {
    this.name = this.route.snapshot.data['header'].title;

    this.workbooksId = this.route.snapshot.data['workbooks'];
    this.workbookId = {...this.workbooksId, key: {wid: '?'}};
  }

  public ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.preloaderService.showLoader();
    this.loadWorkbookInfo();    
  }

  private loadWorkbookInfo(): void {
    this.workbook$ = parseJsonDTOPack<WorkbookModel>(
        this.store$.of(this.workbooksId).pipe(
            finalize(() => this.preloaderService.hideLoader())
        ),
        'workbooks'
    );
  }

  workbookDelete(workbook: WorkbookModel): void {
    this.bus$.publish(
      new CommandDelete(
        this.workbookId,
        workbook,
        {wid: workbook.id}
      )
  );
  }

  workbookEdit(workbook: WorkbookModel): void {
    this.bus$.publish(
      new CommandEdit(
        this.workbookId,
        workbook
      )
    );
  }

  workbookView(workbook: WorkbookModel): void {
    this.bus$.publish(
      new CommandView(
        this.workbookId,
        workbook
      )
    );
  }

  createWorkbook(): void {
    this.bus$.publish(
        new CommandNew(
          this.workbookId
        )
    );
  }
}
