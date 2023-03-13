import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { faker } from '@faker-js/faker';
import { TextBlock, WorkbookModel } from '../../interfaces/document.model';
import { BlockService } from '../../services/block.service';

import { EditorComponent } from './editor.component';

@Component({ selector: 'soer-block-editor', template: `` })
class BlockEditorStubComponent {
  @Input() textBlock: TextBlock = { type: 'markdown', text: '' };
  @Input() localIndex = -1;
  @Input() isEdit = false;
  @Input() isActive = false;
  @Input() blocksLength = 0;
  @Input() blockDelimeter: string | undefined;
}

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [EditorComponent, BlockEditorStubComponent],
      providers: [BlockService],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('setActive', () => {
    it('should set block in active and editing state ', async () => {
      component.document = createFakeDocument();
      const blockIndex = 1;

      component.setActive(blockIndex);

      expect(component.isBlockActive(blockIndex)).toBeTruthy();
      expect(component.isBlockEditable(blockIndex)).toBeTruthy();
    });
  });

  describe('move', () => {
    const from = 0;
    const to = 1;
    let movedBlock: TextBlock;
    let inMovedPositionBlock: TextBlock;

    beforeEach(() => {
      component.document = createFakeDocument();
      movedBlock = component.document.blocks[from];
      inMovedPositionBlock = component.document.blocks[to];
      jest.useFakeTimers();

      component.move(from, to);
      jest.runAllTimers();
    });

    it('should move block', () => {
      expect(component.document.blocks[to]).toBe(movedBlock);
      expect(component.document.blocks[from]).toBe(inMovedPositionBlock);
    });

    it('should set moved block as active block', () => {
      expect(component.isBlockActive(to)).toBeTruthy();
    });

    it('should save editing state after move', () => {
      expect(component.isBlockEditable(from)).toBeFalsy();
      expect(component.isBlockEditable(to)).toBeTruthy();
    });
  });

  describe('addBlockMarkdown', () => {
    beforeEach(() => {
      component.document = createFakeDocument();
    });

    it('should add block', () => {
      const counOfblock = component.document.blocks.length;

      component.addBlockMarkdown(-1);

      expect(component.document.blocks.length).toBe(counOfblock + 1);
    });

    describe('check new block state', () => {
      const newBlockIndex = 1;
      beforeEach(() => {
        component.addBlockMarkdown(0);
      });

      it('should set new block in editing state', () => {
        expect(component.isBlockEditable(newBlockIndex)).toBeTruthy();
      });

      it('should set new block as active block', () => {
        expect(component.isBlockActive(newBlockIndex)).toBeTruthy();
      });
    });

    it('should save editing state for existing blocks after add', () => {
      component.setActive(1);
      component.setActive(3);

      component.addBlockMarkdown(-1);

      expect(component.isBlockEditable(1)).toBeFalsy();
      expect(component.isBlockEditable(2)).toBeTruthy();
      expect(component.isBlockEditable(3)).toBeFalsy();
      expect(component.isBlockEditable(4)).toBeTruthy();
    });
  });

  describe('removeBlock', () => {
    beforeEach(() => {
      component.document = createFakeDocument();
    });

    it('should remove block, if more than 1', () => {
      const countOfblocks = component.document.blocks.length;

      component.removeBlock(1);

      expect(component.document.blocks.length).toBe(countOfblocks - 1);
    });

    it('should not remove block, if only 1 left', () => {
      component.document.blocks.splice(1);

      const countOfblocks = component.document.blocks.length;

      component.removeBlock(0);

      expect(component.document.blocks.length).toBe(countOfblocks);
    });

    describe('check editing state after block removement', () => {
      beforeEach(() => {
        component.setActive(2);
      });

      it('active index should be on the previous block', () => {
        const activeIndex = component.activeIndex;

        component.removeBlock(2);

        expect(component.activeIndex).toBe(activeIndex - 1);
      });

      it('block index should be removed from edit state', () => {
        component.removeBlock(2);

        expect(component.isBlockEditable(2)).toBe(false);
      });
    });
  });

  describe('onEndEdit', () => {
    beforeEach(() => {
      component.document = createFakeDocument();

      component.setActive(2);
    });

    it('block should not be in editing state after end of edition', () => {
      component.onEndEdit(2);

      expect(component.isBlockEditable(2)).toBe(false);
    });

    it('should focus on the previous block', () => {
      component.setActive(1);
      component.onEndEdit(2);

      expect(component.isBlockActive(1)).toBe(true);
    });

    it('should not autofocus, if the editor has no editable blocks', () => {
      component.onEndEdit(2);

      expect(component.activeIndex).toBe(0);
    });
  });
});

function createFakeDocument(): WorkbookModel {
  return {
    id: Number.parseInt(faker.random.numeric()),
    question: faker.random.word(),
    blocks: [
      { text: faker.random.words(1), type: 'markdown' },
      { text: faker.random.words(3), type: 'markdown' },
      { text: faker.random.words(5), type: 'markdown' },
      { text: faker.random.words(7), type: 'markdown' },
    ],
  };
}
