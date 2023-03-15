import {Component, EventEmitter, Input, Output, TemplateRef} from "@angular/core";
import {WorkbookModel} from "@soer/sr-editor";

@Component({
  selector: 'soer-workbooks-view',
  templateUrl: './workbooks-view.component.html',
  styleUrls: ['./workbooks-view.component.scss'],
})
export class WorkbooksViewComponent {
  @Input() emptyListTemplate: TemplateRef<HTMLElement> | null = null;
  @Input() workbooks: WorkbookModel[] = [];
  @Output() workbookEdit = new EventEmitter<WorkbookModel>();
  @Output() workbookView = new EventEmitter<WorkbookModel>();
  @Output() workbookDownload = new EventEmitter<WorkbookModel>();
  @Output() workbookDelete = new EventEmitter<WorkbookModel>();
  @Output() createWorkbook = new EventEmitter<void>();
}
