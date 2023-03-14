import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ActivatedRoute } from '@angular/router';
import { ANY_SERVICE } from '@soer/mixed-bus';
import { of } from 'rxjs';

import { QuestionFormComponent } from './question-form.component';

describe('QuestionFormComponent', () => {
  let component: QuestionFormComponent;
  let fixture: ComponentFixture<QuestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, NzFormModule, NzInputModule],
      declarations: [QuestionFormComponent],
      providers: [
        { provide: 'questions', useValue: ANY_SERVICE },
        { provide: 'question', useValue: ANY_SERVICE },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ action: 'save' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
