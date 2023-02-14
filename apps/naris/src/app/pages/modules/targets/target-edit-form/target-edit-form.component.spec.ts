import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ANY_SERVICE } from '@soer/mixed-bus';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { TargetEditFormComponent } from './target-edit-form.component';

describe('TargetEditFormComponent', () => {
  let component: TargetEditFormComponent;
  let fixture: ComponentFixture<TargetEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NzFormModule, ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule],
      declarations: [TargetEditFormComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { afterCommandDoneRedirectTo: '' } } } },
        { provide: 'target', useValue: ANY_SERVICE },
        FormBuilder,
        UntypedFormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
