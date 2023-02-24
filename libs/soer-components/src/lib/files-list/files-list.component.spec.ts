import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OverlayModule } from '@angular/cdk/overlay';
import { faker } from '@faker-js/faker';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { WebFile } from './files-list.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccessDeniedModule } from '../access-denied/access-denied.module';

import { FilesListComponent } from './files-list.component';

describe('FilesListComponent', () => {
  let component: FilesListComponent;
  let fixture: ComponentFixture<FilesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilesListComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NzCardModule,
        NzTagModule,
        NzGridModule,
        NzIconModule,
        OverlayModule,
        AccessDeniedModule,
        BrowserAnimationsModule.withConfig({ disableAnimations: true }),
      ],
      providers: [NzMessageService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render correct number of files with titles', () => {
    const webFiles = Array.from({ length: 4 }, getWebFile);
    component.webFiles = webFiles;
    fixture.detectChanges();

    const cards: HTMLDivElement[] = fixture.nativeElement.querySelectorAll('.video-info');
    expect(cards.length).toEqual(webFiles.length);

    cards.forEach((card, index) => {
      const header = card.querySelector('.ant-card-meta-title') as HTMLDivElement;
      expect(header).toBeTruthy();
      expect(header.textContent).toEqual(webFiles[index].title);
    });
  });

  it('should not render any files when webFiles is empty', () => {
    component.webFiles = [];
    fixture.detectChanges();

    const cards: HTMLDivElement[] = fixture.nativeElement.querySelectorAll('.video-info');
    expect(cards.length).toEqual(0);
  });

  describe('download', () => {
    let errorMessager: jest.SpyInstance;

    beforeEach(() => {
      const messageService = TestBed.inject(NzMessageService);
      errorMessager = jest.spyOn(messageService, 'error');
    });

    it('should prevent download and show error if not enough permissions', () => {
      component.webFiles = Array.from({ length: 4 }, () => getWebFile({ icon: 'lock', level: 'PRO' }));
      fixture.detectChanges();

      const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.files-card-link');
      link.click();

      expect(errorMessager).toHaveBeenCalledWith('Для скачивания этого файла нужен уровень PRO');
    });

    it('should download file if enough permissions', () => {
      component.webFiles = Array.from({ length: 4 }, () => getWebFile({ icon: 'github', level: 'PRO' }));
      fixture.detectChanges();

      const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.files-card-link');
      link.click();

      expect(errorMessager).not.toHaveBeenCalled();
    });
  });
});

function getWebFile({ icon, level }: Partial<WebFile> = {}): WebFile {
  return {
    title: faker.lorem.word(),
    labels: [faker.lorem.word()],
    url: faker.internet.url(),
    desc: faker.lorem.sentence(),
    level: level ?? faker.helpers.arrayElement(['public', 'workshop', 'pro']),
    icon: icon ?? faker.helpers.arrayElement(['github', 'lock']),
  };
}
