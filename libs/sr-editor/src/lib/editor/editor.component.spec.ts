import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { WorkbookModel } from '../interfaces/document.model';

import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([], { useHash: true })],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [EditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('insertBlocks', () => {
    const doc: WorkbookModel = {
      id: 1,
      question: '',
      blocks: [
        { text: '1', type: 'markdown' },
        { text: '2', type: 'markdown' },
      ],
    };

    it('should add text blocks and change focus when edit first block', () => {
      component.document = { ...doc };
      component.editIndex = 0;
      component.insertBlocks(['h', '']);

      fixture.detectChanges();

      expect(component.editIndex).toBe(1);
      checkTextBlocksMatching(component.document, ['h', '', '2']);
    });

    it('should add text blocks and change focus when edit second block', () => {
      component.document = { ...doc };
      component.editIndex = 1;
      component.insertBlocks(['h', '']);

      fixture.detectChanges();

      expect(component.editIndex).toBe(2);
      checkTextBlocksMatching(component.document, ['1', 'h', '']);
    });

    it('should add several text blocks and change focus when edit the first block', () => {
      component.document = { ...doc };
      component.editIndex = 0;
      component.insertBlocks(['a', 'b', 'c', 'd']);

      fixture.detectChanges();

      expect(component.editIndex).toBe(3);
      checkTextBlocksMatching(component.document, ['a', 'b', 'c', 'd', '2']);
    });
  });
});

function checkTextBlocksMatching({ blocks }: WorkbookModel, textBlocks: string[]) {
  expect(blocks).toHaveLength(textBlocks.length);
  expect(blocks).toEqual(textBlocks.map((s) => ({ text: s, type: 'markdown' })));
}
