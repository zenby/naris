import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DumbModule } from '../../dumb/dumb.module';

import { FilesListComponent } from './files-list.component';
class MockNzMessageService {}

describe('FilesListComponent', () => {
  let component: FilesListComponent;
  let fixture: ComponentFixture<FilesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilesListComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NzGridModule, DumbModule],
      providers: [{ provide: NzMessageService, useClass: MockNzMessageService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
