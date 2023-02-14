import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NzMessageModule } from 'ng-zorro-antd/message';

import { ComposeIcontabsPageComponent } from './compose-icontabs-page.component';

describe('ComposeIcontabsPageComponent', () => {
  let component: ComposeIcontabsPageComponent;
  let fixture: ComponentFixture<ComposeIcontabsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NzMessageModule],
      declarations: [ComposeIcontabsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComposeIcontabsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
