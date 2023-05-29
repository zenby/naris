import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class FilesListComponent {
  @Input() webFiles: WebFile[] = [];
  @Input() assetsUrl = '';
  @Output() download = new EventEmitter<{ file: string; url: string }>();
  constructor(private message: NzMessageService) {}

  getUrl(file: string, level: string): string {
    if (file.match(/^http[s]?:/)) {
      return file;
    }
    return `${this.assetsUrl}${level}/${file}`;
  }

  downloadHandle(event: Event, file: WebFile): void {
    if (file.icon === 'lock') {
      this.message.error(`Для скачивания этого файла нужен уровень ${file.level.toUpperCase()}`);
      event.preventDefault();
      return;
    }
    this.download.emit({
      file: file.url,
      url: this.getUrl(file.url, file.level),
    });
  }
}
