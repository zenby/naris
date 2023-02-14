import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

import { MetricsComponent } from './metrics.component';

describe('MetricsComponent', () => {
  let component: MetricsComponent;
  let fixture: ComponentFixture<MetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NzDividerModule, NzGridModule, NzStatisticModule],
      declarations: [MetricsComponent],
      providers: [
        { provide: 'workbooks', useValue: {} },
        { provide: 'targets', useValue: {} },
        { provide: 'questions', useValue: {} },
        { provide: 'activity', useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                workshops: [{ title: 'Title', desc: 'desc' }],
                streams: [{ title: 'Title', desc: 'desc' }],
                header: { title: 'Title', subtitle: 'subtitle' },
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
