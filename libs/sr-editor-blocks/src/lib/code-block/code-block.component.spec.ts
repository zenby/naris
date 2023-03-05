import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CODE_EXECUTOR_TOKEN } from '@soer/sr-code-runner';

import { CodeBlockComponent } from './code-block.component';

describe('CodeBlockComponent', () => {
  let component: CodeBlockComponent;
  let fixture: ComponentFixture<CodeBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodeBlockComponent],
      providers: [{ provide: CODE_EXECUTOR_TOKEN, useValue: [] }],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
