import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebFile } from '@soer/soer-components';
import { environment } from '../../../../environments/environment';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'soer-sources',
  template:
    '<soer-files-list [loadingFiles]="app.loadingFiles" [assetsUrl]="assetsUrl" [webFiles]="webFiles" (download)="download($event)"></soer-files-list>',
})
export class SourcesComponent implements OnInit {
  webFiles: WebFile[] = [];
  assetsUrl: string = environment.assetsUrl;

  constructor(private route: ActivatedRoute, public app: ApplicationService) {}

  ngOnInit(): void {
    this.webFiles = this.route.snapshot.data['webfiles'];
  }

  download(source: { file: string; url: string }): void {
    this.app.download(source.url, source.file);
  }
}
