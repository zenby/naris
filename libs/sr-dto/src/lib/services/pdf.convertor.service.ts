import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BusError, BusMessage, BusMessageParams, MixedBusService } from '@soer/mixed-bus';
import { WorkbookModel } from '@soer/sr-editor';
import { UrlBuilderService } from '@soer/sr-url-builder';
import { Observable } from 'rxjs';
import { CommandConvertMdToPdf } from '../bus-messages/bus.messages';
import { isCRUDBusEmitter } from '../dto.helpers';
import { ERROR } from '../interfaces/dto.pack.interface';
import { CRUDBusEmitter } from '../sr-dto.module';

@Injectable({ providedIn: 'root' })
export class PdfConverterService {
  constructor(private http: HttpClient, private bus$: MixedBusService, private urlBuilder: UrlBuilderService) {
    bus$.of(CommandConvertMdToPdf).subscribe(this.createPdf.bind(this));
  }

  protected queryCreate(
    data: { content: string },
    owner: CRUDBusEmitter,
    routeParams: BusMessageParams = {}
  ): Observable<ArrayBuffer> {
    return this.http.post<ArrayBuffer>(
      this.urlBuilder.build(':wid', owner.key, routeParams, owner.schema['params'], owner.apiRoot),
      data
    );
  }

  private downloadFile(data: string, owner: CRUDBusEmitter, params: BusMessageParams = {}) {
    this.queryCreate({ content: data }, owner, params).subscribe((res) => {
      const url = window.URL.createObjectURL(new Blob([res], { type: 'application/pdf' }));
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'Conspect';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }
  private getStringMd(data: WorkbookModel): string {
    return (data.blocks || []).reduce((acc, block) => {
      return acc + '  \n' + block.text;
    }, '');
  }

  public createPdf(msg: BusMessage | BusError): Promise<{ status: typeof ERROR; items: [] }> | void {
    if (msg instanceof BusError || !isCRUDBusEmitter(msg.owner)) {
      return Promise.resolve({ status: ERROR, items: [] });
    }
    const md = this.getStringMd(msg.payload);
    this.downloadFile(md, msg.owner, msg.params);
  }
}
