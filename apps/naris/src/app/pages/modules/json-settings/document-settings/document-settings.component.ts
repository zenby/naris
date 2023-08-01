import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusEmitter, MixedBusService } from '@soer/mixed-bus';
import { CommandPatch, DataStoreService, DtoPack, extractDtoPackFromBus, SerializedJsonModel } from '@soer/sr-dto';
import { Observable } from 'rxjs';

@Component({
  selector: 'soer-document-settings',
  templateUrl: './document-settings.component.html',
  styleUrls: ['./document-settings.component.scss'],
})
export class DocumentSettingsComponent {
  documentId: BusEmitter;
  documents$: Observable<DtoPack>;

  constructor(private bus$: MixedBusService, private store$: DataStoreService, private route: ActivatedRoute) {
    this.documentId = this.route.snapshot.data['jsonDocument'];
    this.documents$ = extractDtoPackFromBus<SerializedJsonModel>(this.store$.of(this.documentId));
  }

  accessTag(tag: string): void {
    this.bus$.publish(new CommandPatch(this.documentId, { accessTag: tag }));
  }
}
