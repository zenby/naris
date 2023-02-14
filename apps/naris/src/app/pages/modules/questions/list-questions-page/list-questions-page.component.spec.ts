import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ANY_SERVICE } from '@soer/mixed-bus';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { OnlyWithAnaswerPipe } from '../only-with-anaswer.pipe';

import { ListQuestionsPageComponent } from './list-questions-page.component';

describe('ListQuestionsPageComponent', () => {
  let component: ListQuestionsPageComponent;
  let fixture: ComponentFixture<ListQuestionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListQuestionsPageComponent, OnlyWithAnaswerPipe],
      imports: [HttpClientTestingModule, RouterTestingModule, NzTabsModule, NzResultModule, NzListModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { questions: ANY_SERVICE } } } },
        { provide: 'question', useValue: ANY_SERVICE },
        { provide: 'questionsAll', useValue: ANY_SERVICE },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListQuestionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
