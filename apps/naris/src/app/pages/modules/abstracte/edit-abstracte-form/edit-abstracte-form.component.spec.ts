import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY_WORKBOOK, TextBlockType, WorkbookModel } from '@soer/sr-editor';
import { faker } from '@faker-js/faker';

import { EditAbstracteFormComponent } from './edit-abstracte-form.component';

describe('EditAbstracteFormComponent', () => {
  let component: EditAbstracteFormComponent;
  let fixture: ComponentFixture<EditAbstracteFormComponent>;
  let router: Router;
  let route: ActivatedRoute;

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
    @Input() workbook: WorkbookModel = EMPTY_WORKBOOK;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAbstracteFormComponent, SoerEditorStubComponent],
      imports: [RouterTestingModule.withRoutes([])],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAbstracteFormComponent);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form is in preview state', () => {
    const workbook = fakeWorkbook();

    beforeEach(async () => {
      component.workbook = workbook;
      component.previewFlag = true;
      fixture.detectChanges();
    });

    it('should not be displayed soer-editor', async () => {
      expect(fixture.nativeElement.querySelector('soer-editor')).toBeNull();
    });

    it('should be contained markdown blocks with workbook blocks text', async () => {
      workbook.blocks.forEach((block) => {
        expect(
          fixture.debugElement.query(
            (element) => element.name == 'markdown' && element.nativeElement.textContent == block.text
          )
        ).not.toBeNull();
      });
    });

  });

});
