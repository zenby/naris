import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY_WORKBOOK, TextBlockType, WorkbookModel } from '@soer/sr-editor';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { faker } from '@faker-js/faker';

import { EditAbstracteFormComponent } from './edit-abstracte-form.component';

describe('EditAbstracteFormComponent', () => {
  const subject = new ReplaySubject<Params>();
  const activatedRouteStub = {
    queryParams: subject.asObservable(),
    setQueryParams: (params: Params) => {
      subject.next(params);
    },
  };

  let component: EditAbstracteFormComponent;
  let fixture: ComponentFixture<EditAbstracteFormComponent>;
  let router: Router;
  let route: typeof activatedRouteStub;

  function fakeWorkbook(): WorkbookModel {
    return {
      id: Number.parseInt(faker.random.numeric()),
      question: faker.random.words(3),
      blocks: [
        { text: faker.random.words(2), type: 'markdown' as TextBlockType },
        { text: faker.random.words(5), type: 'markdown' as TextBlockType },
      ],
    };
  }

  @Component({ selector: 'soer-editor', template: `` })
  class SoerEditorStubComponent {
    @Input() document: WorkbookModel = EMPTY_WORKBOOK;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAbstracteFormComponent, SoerEditorStubComponent],
      imports: [RouterTestingModule.withRoutes([]), NzFormModule, FormsModule, ReactiveFormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAbstracteFormComponent);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute) as unknown as typeof activatedRouteStub;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('form is in preview state', () => {
    const workbook = fakeWorkbook();

    beforeEach(async () => {
      component.workbook = workbook;
      route.setQueryParams({ preview: 'true' });
      fixture.detectChanges();
    });

    it('should prewiewFlag assert true', async () => {
      expect(component.previewFlag).toBe(true);
    });

    it('should not display soer-editor', async () => {
      expect(fixture.nativeElement.querySelector('soer-editor')).toBeNull();
    });

    it('should contain markdown blocks with workbook blocks text', async () => {
      workbook.blocks.forEach((block) => {
        expect(
          fixture.debugElement.query(
            (element) => element.name == 'markdown' && element.nativeElement.textContent == block.text
          )
        ).not.toBeNull();
      });
    });
  });

  it('should save event dispatched', () => {
    const workbook = fakeWorkbook();
    component.workbook = workbook;
    jest.spyOn(component.save, 'next');

    route.setQueryParams({ action: 'save' });
    fixture.detectChanges();

    expect(component.save.next).toBeCalledWith(workbook);
  });

  describe('form is in edited state', () => {
    const workbook = fakeWorkbook();

    beforeEach(async () => {
      component.workbook = workbook;
      fixture.detectChanges();
    });

    it('should display soer-editor', async () => {
      expect(fixture.nativeElement.querySelector('soer-editor')).not.toBeNull();
    });

    it('should not display markdown blocks', async () => {
      expect(fixture.nativeElement.querySelector('markdown')).toBeNull();
    });
  });

  describe('workbook question input', () => {
    const workbook = fakeWorkbook();

    beforeEach(() => {
      component.workbook = workbook;
      fixture.detectChanges();
    });

    it('should display workbook question', () => {
      expect(fixture.nativeElement.querySelector('input').value).toBe(workbook.question);
    });

    it('should change workbook question', () => {
      const question = faker.random.words(4);
      const questionInput = fixture.nativeElement.querySelector('input');

      questionInput.value = question;
      questionInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.workbook.question).toBe(question);
    });
  });
});
