import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusEmitter, MixedBusService } from '@soer/mixed-bus';
import { CommandUpdate } from '@soer/sr-dto';

@Component({
  selector: 'soer-document-settings',
  templateUrl: './document-settings.component.html',
  styleUrls: ['./document-settings.component.scss'],
})
export class DocumentSettingsComponent {
  documentId: BusEmitter;
  constructor(private bus$: MixedBusService, private route: ActivatedRoute) {
    this.documentId = this.route.snapshot.data['jsonDocumentSettings'];
    console.log(this.documentId);
  }

  accessTag(tag: string): void {
    this.bus$.publish(new CommandUpdate(this.documentId, { accessTag: tag }));
  }
}
