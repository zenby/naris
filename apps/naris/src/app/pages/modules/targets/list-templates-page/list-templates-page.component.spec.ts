import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ANY_SERVICE } from '@soer/mixed-bus';
import { of } from 'rxjs';

import { ListTemplatesPageComponent } from './list-templates-page.component';

describe('ListTemplatesPageComponent', () => {
  let component: ListTemplatesPageComponent;
  let fixture: ComponentFixture<ListTemplatesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListTemplatesPageComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { templates: ANY_SERVICE } } } },
        { provide: 'target', useValue: ANY_SERVICE },
        { provide: 'template', useValue: ANY_SERVICE },
        { provide: 'publicTemplates', useValue: ANY_SERVICE },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTemplatesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
