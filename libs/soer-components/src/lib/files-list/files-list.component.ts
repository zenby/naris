import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

export type WebFile = {
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
  @Input() loadingFiles: { [key: string]: boolean } = {};

  @Input() assetsUrl = '';
  @Output() download = new EventEmitter<{ file: string; url: string }>();
  constructor(private message: NzMessageService) {}

  getUrl(file: string, level: string): string {
    if (file.match(/^http[s]?:/)) {
      return file;
    }
    return `${this.assetsUrl}${level}/${file}`;
  }

  isLoading(key: string): boolean {
    return !!this.loadingFiles[key];
  }

  hasAccess(event: Event, file: WebFile): boolean {
    if (file.icon === 'lock') {
      this.message.error(`Для скачивания этого файла нужен уровень ${file.level.toUpperCase()}`);
      event.preventDefault();
      return false;
    }
    return true;
  }

  downloadHandle(event: Event, file: WebFile): void {
    if (this.hasAccess(event, file)) {
      this.download.emit({
        file: file.url,
        url: this.getUrl(file.url, file.level),
      });
    }
  }
}
