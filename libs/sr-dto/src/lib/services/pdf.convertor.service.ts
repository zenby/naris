import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BusError, BusMessage, MixedBusService } from "@soer/mixed-bus";
import { UrlBuilderService } from "@soer/sr-url-builder";
import { Observable } from "rxjs";
import { CommandConvertMdToPdf } from "../bus-messages/bus.messages";
import { isCRUDBusEmitter } from "../dto.helpers";
import { DtoPack, ERROR } from "../interfaces/dto.pack.interface";
import { CRUDBusEmitter } from "../sr-dto.module";

@Injectable(
    { providedIn: 'root' }
)
export class PdfConverterService {

    constructor(
        private http: HttpClient,
        private bus$: MixedBusService,
        private urlBuilder: UrlBuilderService
    ) {
        const wnd = (window as any);
        wnd.store$ = this;
        console.log('Start RESTfull CRUD events service');
        bus$.of(CommandConvertMdToPdf).subscribe(this.createPdf.bind(this));
    }
    protected queryCreate(data: any, owner: CRUDBusEmitter, routeParams: any): Observable<DtoPack<any>> {
        return this.http.post<DtoPack<any>>(this.urlBuilder.build(':wid', owner.key, routeParams, owner.schema['params']), data);
    }
    private downloadFile(data:any, owner: any, params: any) {
        this.queryCreate({content: data}, owner, params)
        .subscribe((res: any)=>{
        debugger
        let url = window.URL.createObjectURL(new Blob([res], {type: 'application/pdf'}));
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = 'Conspect';
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        })
    }
    private getMd(data: any) {
        return data.blocks[0].text
    }

    public createPdf(msg: BusMessage | BusError): Promise<any> | void {
        if (msg instanceof BusError || !isCRUDBusEmitter(msg.owner)) {
            return Promise.resolve({status: ERROR, items: []});
        }
        const md = this.getMd(msg.payload)
        this.downloadFile(md, msg.owner, msg.params)
    }
}