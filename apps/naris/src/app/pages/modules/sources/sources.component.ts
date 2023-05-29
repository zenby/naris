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
    this.webFiles = [
      {
        title: 'xDonate',
        labels: ['v0.2.0'],
        url: 'xdonate.zip',
        desc: 'Система донатов для персонального использования',
        level: 'pro',
        icon: 'download',
      },

      {
        title: 'SOER PRO',
        labels: ['github', 'Frontend'],
        url: 'https://github.com/soerdev/soer',
        desc: 'Фронтенд часть проекта SOER PRO ',
        level: 'public',
        icon: 'github',
      },
      {
        title: 'SOER PRO',
        labels: ['v1.9.0', 'Backend', '22.05.2022'],
        url: 'backend_1_9.zip',
        desc: 'Бекенд часть проекта SOER PRO',
        level: 'pro',
        icon: 'download',
      },
      {
        title: 'Примеры из видео',
        labels: ['Examples'],
        url: 'examples.zip',
        desc: 'Разные примеры из видео на канале',
        level: 'pro',
        icon: 'download',
      },
      {
        title: 'Архив писем подписчикам',
        labels: ['pdf', 'письма'],
        url: 'letters.zip',
        desc: 'Информационные письма патронам',
        level: 'pro',
        icon: 'file-text',
      },
      {
        title: 'Архив конспектов по книгам',
        labels: ['pdf', 'конспекты'],
        url: 'workbooks.zip',
        desc: 'Конспекты которые я писал по книгам для патронов',
        level: 'pro',
        icon: 'file-text',
      },
      {
        title: 'Архив стримов 2020 год',
        labels: ['mp4', '4.3Gb', '7'],
        url: '2020.zip',
        desc: 'Записи всех стримов за 2020 год',
        level: 'pro',
        icon: 'youtube',
      },
      {
        title: 'Архив стримов 2021 год',
        labels: ['mp4', '5.2Gb', '12'],
        url: '2021.zip',
        desc: 'Записи всех стримов за 2021 год',
        level: 'pro',
        icon: 'youtube',
      },
      {
        title: 'Архив стримов 2022 год',
        labels: ['mp4', '2.9Gb', '5'],
        url: '2022.zip',
        desc: 'Записи всех стримов за 2022 год',
        level: 'pro',
        icon: 'youtube',
      },
      {
        title: 'Архив конспектов из архитектурных стримов',
        labels: ['pdf', 'конспекты'],
        url: 'pdf.zip',
        desc: 'В архиве те конспекты, которые я использую в видео архитектурных стримов',
        level: 'pro',
        icon: 'file-text',
      },
    ];

    this.route.snapshot.data['webfiles'];
  }

  download(source: { file: string; url: string }): void {
    this.app.download(source.url, source.file);
  }
}
