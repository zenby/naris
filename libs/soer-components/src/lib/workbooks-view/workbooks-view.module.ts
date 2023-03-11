import {NgModule} from "@angular/core";
import {WorkbooksViewComponent} from "./workbooks-view/workbooks-view.component";
import {CommonModule} from "@angular/common";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzResultModule} from "ng-zorro-antd/result";
import {NzButtonModule} from "ng-zorro-antd/button";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [WorkbooksViewComponent],
  imports: [
    FormsModule,
    CommonModule,
    NzPopconfirmModule,
    NzIconModule,
    NzButtonModule
  ],
  exports: [WorkbooksViewComponent]
})
export class WorkbooksViewModule {}
