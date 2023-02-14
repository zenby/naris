import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DumbModule } from '../../dumb/dumb.module';

import { ComposeVideoPlayerComponent } from './compose-video-player.component';

describe('ComposeVideoPlayerComponent', () => {
  let component: ComposeVideoPlayerComponent;
  let fixture: ComponentFixture<ComposeVideoPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComposeVideoPlayerComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, DumbModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposeVideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
