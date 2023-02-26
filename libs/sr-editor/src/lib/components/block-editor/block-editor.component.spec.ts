import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewContainerRef, ComponentRef } from '@angular/core';
import { faker } from '@faker-js/faker';
import { EDITOR_BLOCKS_REGISTRY_TOKEN } from '../../editor-blocks-config';
import { TypeFormatPipe } from '../../pipes/type-format.pipe';
import { BooleanToStringPipe } from '../../pipes/boolean-to-string.pipe';
import { BasicBlockComponent } from '../basic-block.component';
import { TextBlock } from '../../interfaces/document.model';
import { FormsModule } from '@angular/forms';

import { BlockEditorComponent } from './block-editor.component';

describe('BlockEditorComponent', () => {
  let component: BlockEditorComponent;
  let fixture: ComponentFixture<BlockEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [BlockEditorComponent, TypeFormatPipe, BooleanToStringPipe],
      providers: [
        {
          provide: EDITOR_BLOCKS_REGISTRY_TOKEN,
          useValue: {} as unknown,
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
    const multilineTextProviders = [
      { lineBreakSymbol: '\\n', multiLineText: faker.random.words(2).replaceAll(' ', '\n') },
      { lineBreakSymbol: '\\r', multiLineText: faker.random.words(3).replaceAll(' ', '\r') },
      { lineBreakSymbol: '\\r\\n', multiLineText: faker.random.words(4).replaceAll(' ', '\r\n') },
    ];

    beforeEach(() => {
      component.localIndex = Number.parseInt(faker.random.numeric());
      component.isEdit = true;
      component.componentRef = createFakeComponentRef();
      component.textBlock = createFakeTextBlock();
      jest.spyOn(component.setActive, 'next');
      jest.spyOn(component.endEdit, 'next');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should call command handler', () => {
      component.isEdit = true;
      fixture.detectChanges();
      const textarea = fixture.nativeElement.querySelector('textarea');
      const event = new KeyboardEvent('keydown');
      jest.spyOn(component, 'command');

      textarea.dispatchEvent(event);

      expect(component.command).toBeCalledWith(event);
    });

    describe('Ctrl + ArrowUp event', () => {
      const multiLineText = createMultiLineText();
      const cursorPosition = getSecondLineCursorPosition(multiLineText);

      beforeEach(() => {
        component.textBlock.text = multiLineText;
      });

      it('should set active previous', () => {
        const event = createKeyboardEvent({
          code: 'ArrowUp',
          cursorPosition,
          ctrlKey: true,
        });

        component.command(event);

        expectShouldStopEdit(component);
        expectShouldSetActivePrevious(component);
      });

      it('should not set active previous because it is without ctrl', () => {
        const event = createKeyboardEvent({
          code: 'ArrowUp',
          cursorPosition,
          ctrlKey: false,
        });

        component.command(event);

        expectShouldNotStopEdit(component);
        expectShouldNotDispatchSetActiveEvent(component);
      });
    });

    describe('Ctrl + ArrowDown event', () => {
      const multiLineText = createMultiLineText();
      const cursorPosition = getSecondLineCursorPosition(multiLineText);

      beforeEach(() => {
        component.textBlock.text = multiLineText;
      });

      it('should set active next', () => {
        const event = createKeyboardEvent({
          code: 'ArrowDown',
          cursorPosition,
          ctrlKey: true,
        });

        component.command(event);

        expectShouldStopEdit(component);
        expectShouldSetActiveNext(component);
      });

      it('should not set active next because because it is without ctrl', () => {
        const event = createKeyboardEvent({
          code: 'ArrowDown',
          cursorPosition,
          ctrlKey: false,
        });

        component.command(event);

        expectShouldNotStopEdit(component);
        expectShouldNotDispatchSetActiveEvent(component);
      });
    });

    describe('ArrowUp event', () => {
      it('should set active previous', () => {
        const cursorPosition = 0;
        const event = createKeyboardEvent({
          code: 'ArrowUp',
          cursorPosition,
        });

        component.command(event);

        expectShouldStopEdit(component);
        expectShouldSetActivePrevious(component);
      });

      it.each(multilineTextProviders)(
        'should not set active previous because is not first line with line break symbol: $lineBreakSymbol',
        ({ multiLineText }) => {
          component.textBlock.text = multiLineText;
          const cursorPosition = multiLineText.length;
          const event = createKeyboardEvent({
            code: 'ArrowUp',
            cursorPosition,
          });

          component.command(event);

          expectShouldNotStopEdit(component);
          expectShouldNotDispatchSetActiveEvent(component);
        }
      );

      it('should not set active previous because is not ArrowUp event', () => {
        const event = createKeyboardEvent({
          code: 'ArrowLeft',
          cursorPosition: 0,
        });

        component.command(event);

        expectShouldNotStopEdit(component);
        expectShouldNotDispatchSetActiveEvent(component);
      });
    });

    describe('ArrowDown event', () => {
      it.each(multilineTextProviders)(
        'should set active next with line break symbol: $lineBreakSymbol',
        ({ multiLineText }) => {
          component.textBlock.text = multiLineText;
          const cursorPosition = multiLineText.length;
          const event = createKeyboardEvent({
            code: 'ArrowDown',
            cursorPosition,
          });

          component.command(event);

          expectShouldStopEdit(component);
          expectShouldSetActiveNext(component);
        }
      );

      it.each(multilineTextProviders)(
        'should not set active next because is not last line with line break symbol: $lineBreakSymbol',
        ({ lineBreakSymbol, multiLineText }) => {
          component.textBlock.text = multiLineText;
          const cursorPosition = multiLineText.indexOf(lineBreakSymbol) + 1;
          const event = createKeyboardEvent({
            code: 'ArrowDown',
            cursorPosition,
          });

          component.command(event);

          expectShouldNotStopEdit(component);
          expectShouldNotDispatchSetActiveEvent(component);
        }
      );

      it('should not set active next because is not ArrowDown event', () => {
        const event = createKeyboardEvent({
          code: 'ArrowLeft',
          cursorPosition: 0,
        });

        component.command(event);

        expectShouldNotStopEdit(component);
        expectShouldNotDispatchSetActiveEvent(component);
      });
    });

    function createMultiLineText() {
      return faker.random.words(5).replaceAll(' ', '\n');
    }

    function getSecondLineCursorPosition(multiLineText: string) {
      return multiLineText.indexOf('\n', multiLineText.indexOf('\n') + 3);
    }

    function createKeyboardEvent({
      code,
      cursorPosition = 0,
      ctrlKey = false,
    }: {
      code: string;
      cursorPosition?: number;
      ctrlKey?: boolean;
    }) {
      return {
        code,
        ctrlKey,
        target: { selectionStart: cursorPosition },
      } as unknown as KeyboardEvent;
    }

    function expectShouldStopEdit(component: BlockEditorComponent) {
      expect(component.endEdit.next).toBeCalledWith(component.localIndex);
      expect(component.isEdit).toBe(false);
      expect(component.componentRef?.instance?.text).toBe(component.textBlock.text);
    }

    function expectShouldNotStopEdit(component: BlockEditorComponent) {
      expect(component.endEdit.next).not.toBeCalled();
      expect(component.isEdit).toBe(true);
      expect(component.componentRef?.instance?.text).not.toBe(component.textBlock.text);
    }

    function expectShouldSetActivePrevious(component: BlockEditorComponent) {
      expect(component.setActive.next).toBeCalledWith(component.localIndex - 1);
    }

    function expectShouldSetActiveNext(component: BlockEditorComponent) {
      expect(component.setActive.next).toBeCalledWith(component.localIndex + 1);
    }

    function expectShouldNotDispatchSetActiveEvent(component: BlockEditorComponent) {
      expect(component.setActive.next).not.toBeCalled();
    }
  });
});

function createFakeComponentRef(): ComponentRef<BasicBlockComponent> {
  return {
    instance: {
      text: faker.random.words(5),
    },
  } as unknown as ComponentRef<BasicBlockComponent>;
}

function createFakeTextBlock(): TextBlock {
  return {
    type: 'markdown',
    text: faker.random.words(3),
  };
}
