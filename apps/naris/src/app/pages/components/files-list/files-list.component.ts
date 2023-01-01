import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';

type WebFile = {
  title: string;
  labels: string[];
  url: string;
  desc: string;
  level: string;
  icon: string;
};

@Component({
  selector: 'soer-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss'],
})
export class FilesListComponent implements OnInit {
  webFiles: WebFile[] = [];

  constructor(private route: ActivatedRoute, private message: NzMessageService) {}

  ngOnInit(): void {
    this.webFiles = this.route.snapshot.data['webfiles'];
  }

  url(file: string, level: string): string {
    if (file.match(/^http[s]?:/)) {
      return file;
    }
    return `${environment.assetsUrl}${level}/${file}`;
  }

  download(event: Event, file: WebFile): void {
    if (file.icon === 'lock') {
      this.message.error(`Для скачивания этого файла нужен уровень ${file.level.toUpperCase()}`);
      event.preventDefault();
    }
  }
}
