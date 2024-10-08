import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusEmitter, MixedBusService } from '@soer/mixed-bus';
import { PreloaderService } from '@soer/soer-components';
import { CommandDelete, CommandEdit, CommandNew, CommandView, DataStoreService, DtoPack } from '@soer/sr-dto';
import { WorkbookModel } from '@soer/sr-editor';
import { MarkdownService } from 'ngx-markdown';
import { Observable, finalize } from 'rxjs';
import { parseJsonDTOPack } from '../../../../api/json.dto.helpers';
import { printHTML } from '../abstracte.helper';

// TODO: вынести в отдельный файл, подумать над его местом в структуре
export enum LoadingState {
  OK = 'ok',
  ERROR = 'error',
  LOADING = 'loading',
  UPDATE = 'update',
  INIT = 'init',
}

@Component({
  selector: 'soer-list-abstracte-page',
  templateUrl: './list-abstracte-page.component.html',
  styleUrls: ['./list-abstracte-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListAbstractePageComponent implements OnInit {
  public name? = '';
  public title = '';
  public info = '';

  private workbooksId: BusEmitter;
  private workbookId: BusEmitter;

  public workbook$!: Observable<DtoPack<WorkbookModel>>;

  /* TODO: 
        реализовать условный рендеринга шаблонов не на основе статуса workbooks, а на основе статуса из стора
        
        т.е вместо:
        <ng-container *ngIf="(workbook$ | async) as workbooks">
            <ng-container [ngSwitch]="workbooks.status">
                <ng-container *ngSwitchCase="loadingState.OK">

        будет:
            <ng-container [ngSwitch]="(loadingState$ | async)!">
                <ng-container *ngSwitchCase="loadingState.OK">
                    ...
                </ng-container>

                <ng-container *ngSwitchCase="loadingState.LOADING">
                    ...
                </ng-container>

                ...

        для этого нужно:
        сделать отдельный стейт-сервис для конспектов, который будет отвечать за взаимодействие со стором и 
        возвращать текущее состояние загрузки для конкретного компонент

        т.е, например
        public get loadingState$(): Observable<LoadingState> {
            return this.documentsService.documentsViewLoadingState$;
              или
            return this.workbooksService.workbooksViewLoadingState$;
        }

        documentsService в свою очередь будет возвращать методы извлечения состояния из стора

        т.е, например
        public get documentsViewLoadingState$(): Observable<LoadingState> {
            return this.store$.select(getDocumentsViewLoadingState);
        }

        для всего этого нужно переделать текущую реализацию стора на NgRx стор, чтобы не писать все вручную 
  */
  public loadingState = LoadingState;

  constructor(
    private bus$: MixedBusService,
    private store$: DataStoreService,
    private route: ActivatedRoute,
    private preloaderService: PreloaderService,
    private markdownService: MarkdownService
  ) {
    this.name = this.route.snapshot.data['header'].title;
    this.title = this.route.snapshot.data['page'].title;
    this.info = this.route.snapshot.data['page'].info;

    this.workbooksId = this.route.snapshot.data['workbooks'];
    this.workbookId = { ...this.workbooksId, key: { wid: '?' } };
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData(): void {
    this.preloaderService.showLoader();
    this.loadWorkbookInfo();
  }

  private loadWorkbookInfo(): void {
    this.workbook$ = parseJsonDTOPack<WorkbookModel>(
      this.store$.of(this.workbooksId).pipe(finalize(() => this.preloaderService.hideLoader())),
      'workbooks'
    );
  }

  workbookDelete(workbook: WorkbookModel): void {
    this.bus$.publish(new CommandDelete(this.workbookId, workbook, { wid: workbook.id }));
  }

  workbookEdit(workbook: WorkbookModel): void {
    this.bus$.publish(new CommandEdit(this.workbookId, workbook));
  }

  workbookView(workbook: WorkbookModel): void {
    this.bus$.publish(new CommandView(this.workbookId, workbook));
  }

  workbookDownload(workbook: WorkbookModel): void {
    let workbookHtml = '';

    if (workbook.text && workbook.text.length > 0) {
      workbookHtml = this.markdownService.parse(`<markdown>${workbook.text}</markdown>`);
    }

    if (workbook.blocks && workbook.blocks.length > 0) {
      workbook.blocks.forEach(
        (block) => (workbookHtml += this.markdownService.parse(`<markdown>${block.text}</markdown>`))
      );
    }

    printHTML(workbookHtml);
  }

  createWorkbook(): void {
    this.bus$.publish(new CommandNew(this.workbookId));
  }
}
