import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EDITOR_BLOCKS_REGISTRY_TOKEN, SrEditorModule } from '@soer/sr-editor';
import { NzFormModule } from 'ng-zorro-antd/form';

import { EditAbstracteFormComponent } from './edit-abstracte-form.component';

@Component({ selector: 'soer-mock-component' })
class MockComponent {}

describe('EditAbstracteFormComponent', () => {
  let component: EditAbstracteFormComponent;
  let fixture: ComponentFixture<EditAbstracteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, SrEditorModule, NzFormModule],
      declarations: [EditAbstracteFormComponent],
      providers: [
        {
          provide: EDITOR_BLOCKS_REGISTRY_TOKEN,
          useValue: {
            markdown: MockComponent,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAbstracteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
