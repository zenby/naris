import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

export type ConfirmData = {
  [key: string]: string | number;
};

export type ConfirmContent = {
  title: string;
  content: string;
  data: ConfirmData;
};

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  private showSubject = new Subject<ConfirmContent>();
  private confirmSubject = new Subject<ConfirmData>();
  private cancelSubject = new Subject<ConfirmData>();

  public showConfirm$: Observable<ConfirmContent> = this.showSubject.asObservable();
  public onConfirm$: Observable<ConfirmData> = this.confirmSubject.asObservable();
  public onCancle$: Observable<ConfirmData> = this.cancelSubject.asObservable();

  show(content: ConfirmContent) {
    this.showSubject.next(content);
  }

  confirm(data: ConfirmData) {
    this.confirmSubject.next(data);
  }

  cancel(data: ConfirmData) {
    this.cancelSubject.next(data);
  }
}
