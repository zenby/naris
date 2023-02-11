import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NzMessageModule } from 'ng-zorro-antd/message';

import { ComposeIcontabsPageComponent } from './compose-icontabs-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NzMessageService } from 'ng-zorro-antd/message';

class MockNzMessageService {}

describe('ComposeIcontabsPageComponent', () => {
  let component: ComposeIcontabsPageComponent;
  let fixture: ComponentFixture<ComposeIcontabsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NzMessageModule],
      declarations: [ComposeIcontabsPageComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: NzMessageService, useClass: MockNzMessageService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ComposeIcontabsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
