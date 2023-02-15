import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ANY_SERVICE } from '@soer/mixed-bus';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { ListTargetsPageComponent } from './list-targets-page.component';

describe('ListTargetsPageComponent', () => {
  let component: ListTargetsPageComponent;
  let fixture: ComponentFixture<ListTargetsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [NzEmptyModule, RouterTestingModule],
      declarations: [ListTargetsPageComponent],
      providers: [
        { provide: 'target', useValue: ANY_SERVICE },
        { provide: 'targets', useValue: ANY_SERVICE },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTargetsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
