import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ANY_SERVICE } from '@soer/mixed-bus';
import { QuestionsConfigService } from '../services/questions-config.service';

import { QuestionViewComponent } from './question-view.component';

describe('QuestionViewComponent', () => {
  let component: QuestionViewComponent;
  let fixture: ComponentFixture<QuestionViewComponent>;

  const questionsConfigServiceMock = {
    setAudioPlayerSpeed: jest.fn(),
    getAudioPlayerSpeed: jest.fn(() => 5),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionViewComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { question: ANY_SERVICE } } } },
        { provide: 'question', useValue: ANY_SERVICE },
        { provide: 'questionsAll', useValue: ANY_SERVICE },
        { provide: QuestionsConfigService, useValue: questionsConfigServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set audioPlayer speed from questionsControlService', () => {
    expect(component.audioSpeed).toEqual(5);
    expect(questionsConfigServiceMock.getAudioPlayerSpeed).toHaveBeenCalled();
  });

  it('changeAudioSpeed method calls questionsControlService with correct arguments', () => {
    component.changeAudioSpeed(2);

    expect(questionsConfigServiceMock.setAudioPlayerSpeed).toHaveBeenCalledWith(2);
  });
});
