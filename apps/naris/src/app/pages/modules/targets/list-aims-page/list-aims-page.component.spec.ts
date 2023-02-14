import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ANY_SERVICE, MixedBusModule } from '@soer/mixed-bus';
import { SrDTOModule } from '@soer/sr-dto';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { ListAimsPageComponent } from './list-aims-page.component';
class MockNzNotificationService {}

describe('ListAimsPageComponent', () => {
  let component: ListAimsPageComponent;
  let fixture: ComponentFixture<ListAimsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListAimsPageComponent],
      imports: [MixedBusModule, SrDTOModule, NzTabsModule, NzEmptyModule, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, data: { targets: ANY_SERVICE } } } },
        { provide: 'target', useValue: ANY_SERVICE },
        { provide: 'targets', useValue: ANY_SERVICE },
        { provide: NzNotificationService, useClass: MockNzNotificationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAimsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
