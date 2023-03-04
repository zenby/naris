import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkdownModule } from 'ngx-markdown';
import { TestBlockComponent } from './test-block.component';

describe('TestBlockComponent', () => {
  let component: TestBlockComponent;
  let fixture: ComponentFixture<TestBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestBlockComponent],
      imports: [MarkdownModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
