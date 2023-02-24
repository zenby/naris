import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebFile } from '@soer/soer-components';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'soer-sources',
  template: '<soer-files-list [assetsUrl]="assetsUrl" [webFiles]="webFiles"></soer-files-list>',
})
export class SourcesComponent implements OnInit {
  webFiles: WebFile[] = [];
  assetsUrl: string = environment.assetsUrl;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.webFiles = this.route.snapshot.data['webfiles'];
  }
}
