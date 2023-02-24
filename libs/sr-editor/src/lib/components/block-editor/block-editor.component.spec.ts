import { ComponentFixture, TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { EDITOR_BLOCKS_REGISTRY_TOKEN } from '../../editor-blocks-config';
import { TypeFormatPipe } from '../../pipes/type-format.pipe';
import { BooleanToStringPipe } from '../../pipes/boolean-to-string.pipe';

import { BlockEditorComponent } from './block-editor.component';
import { ViewContainerRef } from '@angular/core';

describe('BlockEditorComponent', () => {
  let component: BlockEditorComponent;
  let fixture: ComponentFixture<BlockEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockEditorComponent, TypeFormatPipe, BooleanToStringPipe],
      providers: [
        {
          provide: EDITOR_BLOCKS_REGISTRY_TOKEN,
          useValue: [] as unknown,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockEditorComponent);
    component = fixture.componentInstance;
    component.editComponent = {
      createComponent: () => ({
        instance: {
          text: '',
        },
        changeDetectorRef: {
          detectChanges: jest.fn(),
        },
      }),
    } as unknown as ViewContainerRef;
    fixture.detectChanges();
  });

  describe('command', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('Ctrl + ArrowUp event', () => {
      beforeEach(() => {
        jest.spyOn(component, 'setActivePrevious');
      });

      it('should call setActivePrevious', () => {
        const eventStub = {
          code: 'ArrowUp',
          ctrlKey: true,
        } as unknown as KeyboardEvent;

        component.command(eventStub);

        expect(component.setActivePrevious).toBeCalled();
      });

      it('should not call setActivePrevious because it is without ctrl', () => {
        const falseEventStub = {
          code: 'ArrowUp',
          ctrlKey: false,
        } as unknown as KeyboardEvent;
        jest.spyOn(component, 'getIsFirstLine').mockReturnValue(false);

        component.command(falseEventStub);

        expect(component.setActivePrevious).not.toBeCalled();
      });
    });

    describe('Ctrl + ArrowDown event', () => {
      beforeEach(() => {
        jest.spyOn(component, 'setActiveNext');
      });

      it('should call setActiveNext', () => {
        const eventStub = {
          code: 'ArrowDown',
          ctrlKey: true,
        } as unknown as KeyboardEvent;

        component.command(eventStub);

        expect(component.setActiveNext).toBeCalled();
      });

      it('should not call setActiveNext because because it is without ctrl', () => {
        const falseEventStub = {
          code: 'ArrowDown',
          ctrlKey: false,
        } as unknown as KeyboardEvent;
        jest.spyOn(component, 'getIsLastLine').mockReturnValue(false);

        component.command(falseEventStub);

        expect(component.setActiveNext).not.toBeCalled();
      });
    });

    describe('ArrowUp event', () => {
      let getIsFirstLineStub: jest.SpyInstance;
      const eventStub = {
        code: 'ArrowUp',
      } as unknown as KeyboardEvent;

      beforeEach(() => {
        getIsFirstLineStub = jest.spyOn(component, 'getIsFirstLine');
        jest.spyOn(component, 'setActivePrevious');
      });

      it('should call setActivePrevious', () => {
        getIsFirstLineStub.mockReturnValue(true);

        component.command(eventStub);

        expect(component.setActivePrevious).toBeCalled();
      });

      it('should not call setActivePrevious because is not first line', () => {
        getIsFirstLineStub.mockReturnValue(false);

        component.command(eventStub);

        expect(component.setActivePrevious).not.toBeCalled();
      });

      it('should not call setActivePrevious because is not ArrowUp event', () => {
        getIsFirstLineStub.mockReturnValue(true);
        const falseEventStub = {
          code: 'ArrowLeft',
        } as unknown as KeyboardEvent;

        component.command(falseEventStub);

        expect(component.setActivePrevious).not.toBeCalled();
      });
    });

    describe('ArrowDown event', () => {
      let getIsLastLineStub: jest.SpyInstance;
      const eventStub = {
        code: 'ArrowDown',
      } as unknown as KeyboardEvent;

      beforeEach(() => {
        getIsLastLineStub = jest.spyOn(component, 'getIsLastLine');
        jest.spyOn(component, 'setActiveNext');
      });

      it('should call setActiveNext', () => {
        getIsLastLineStub.mockReturnValue(true);

        component.command(eventStub);

        expect(component.setActiveNext).toBeCalled();
      });

      it('should not call setActiveNext because is not last line', () => {
        getIsLastLineStub.mockReturnValue(false);

        component.command(eventStub);

        expect(component.setActiveNext).not.toBeCalled();
      });

      it('should not call setActiveNext because is not ArrowDown event', () => {
        getIsLastLineStub.mockReturnValue(false);
        const falseEventStub = {
          code: 'ArrowLeft',
        } as unknown as KeyboardEvent;

        component.command(falseEventStub);

        expect(component.setActiveNext).not.toBeCalled();
      });
    });
  });

  describe('stopEdit', () => {
    it('should endEdit event dispatched', () => {
      const localIndex = Number.parseInt(faker.random.numeric());
      component.localIndex = localIndex;
      jest.spyOn(component.endEdit, 'next');

      component.stopEdit();

      expect(component.endEdit.next).toBeCalledWith(localIndex);
    });

    it('should set isEdit is false', () => {
      component.isEdit = true;

      component.stopEdit();

      expect(component.isEdit).toBe(false);
    });
  });

  describe('setActivePrevious', () => {
    it('should call stopEdit', () => {
      jest.spyOn(component, 'stopEdit');

      component.setActivePrevious();

      expect(component.stopEdit).toBeCalled();
    });

    it('should setActive event dispatched', () => {
      const localIndex = Number.parseInt(faker.random.numeric());
      component.localIndex = localIndex;
      jest.spyOn(component.setActive, 'next');

      component.setActivePrevious();

      expect(component.setActive.next).toBeCalledWith(localIndex - 1);
    });
  });

  describe('setActiveNext', () => {
    it('should call stopEdit', () => {
      jest.spyOn(component, 'stopEdit');

      component.setActiveNext();

      expect(component.stopEdit).toBeCalled();
    });

    it('should setActive event dispatched', () => {
      const localIndex = Number.parseInt(faker.random.numeric());
      component.localIndex = localIndex;
      jest.spyOn(component.setActive, 'next');

      component.setActiveNext();

      expect(component.setActive.next).toBeCalledWith(localIndex + 1);
    });
  });

  describe('getIsFirstLine', () => {
    let getLineNumberWhereCursorIsStub: jest.SpyInstance;
    const eventStub = {} as unknown as KeyboardEvent;

    beforeEach(() => {
      getLineNumberWhereCursorIsStub = jest.spyOn(component, 'getLineNumberWhereCursorIs');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should first line', () => {
      getLineNumberWhereCursorIsStub.mockReturnValue(1);

      expect(component.getIsFirstLine(eventStub)).toBe(true);
    });

    it('should not first line', () => {
      getLineNumberWhereCursorIsStub.mockReturnValue(2);

      expect(component.getIsFirstLine(eventStub)).toBe(false);
    });
  });

  describe('getIsLastLine', () => {
    let getLineNumberWhereCursorIsStub: jest.SpyInstance;
    let getCountOfLines: jest.SpyInstance;
    const eventStub = {} as unknown as KeyboardEvent;

    beforeEach(() => {
      getLineNumberWhereCursorIsStub = jest.spyOn(component, 'getLineNumberWhereCursorIs');
      getCountOfLines = jest.spyOn(component, 'getCountOfLines');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should last line', () => {
      getLineNumberWhereCursorIsStub.mockReturnValue(1);
      getCountOfLines.mockReturnValue(1);

      expect(component.getIsLastLine(eventStub)).toBe(true);
    });

    it('should not last line', () => {
      getLineNumberWhereCursorIsStub.mockReturnValue(2);
      getCountOfLines.mockReturnValue(1);

      expect(component.getIsLastLine(eventStub)).toBe(false);
    });
  });

  describe('getLineNumberWhereCursorIs', () => {
    const someLongText = faker.lorem.words(30);
    const textLength = someLongText.length;
    const middleOfLine = Math.round(someLongText.length / 2);

    it.each([
      { cursorPosition: 0, expected: '' },
      { cursorPosition: middleOfLine, expected: someLongText.substring(0, middleOfLine) },
      { cursorPosition: textLength, expected: someLongText },
    ])('should called getCountOfLines with text: $expected', ({ cursorPosition, expected }) => {
      component.textBlock.text = someLongText;
      const eventStub = {
        target: {
          selectionStart: cursorPosition,
        },
      } as unknown as KeyboardEvent;
      jest.spyOn(component, 'getCountOfLines');

      component.getLineNumberWhereCursorIs(eventStub);

      expect(component.getCountOfLines).toBeCalledWith(expected);
    });
  });

  describe('getCountOfLines', () => {
    it.each([
      { lineBreakSymbol: '\\n', text: faker.random.words(2).replaceAll(' ', '\n'), expected: 2 },
      { lineBreakSymbol: '\\r', text: faker.random.words(3).replaceAll(' ', '\r'), expected: 3 },
      { lineBreakSymbol: '\\r\\n', text: faker.random.words(4).replaceAll(' ', '\r\n'), expected: 4 },
    ])('should find $expected line in text with line break symbol is $lineBreakSymbol', ({ text, expected }) => {
      expect(component.getCountOfLines(text)).toBe(expected);
    });
  });
});
