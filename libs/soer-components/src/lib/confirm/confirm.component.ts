import { Component, OnInit } from '@angular/core';

import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ConfirmContent, ConfirmService } from './confirm.service';

@Component({
  selector: 'soer-confirm',
  template: '',
})
export class ConfirmComponent implements OnInit {
  confirmModal?: NzModalRef;

  constructor(private modal: NzModalService, private service: ConfirmService) {}

  ngOnInit(): void {
    this.service.showConfirm$.subscribe((content: ConfirmContent) => this.showConfirm(content));
  }

  showConfirm(content: ConfirmContent): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: content.title,
      nzContent: content.content,
      nzOnOk: () => {
        this.service.confirm(content.data);
      },
      nzOnCancel: () => {
        this.service.cancel(content.data);
      },
    });
  }
}
