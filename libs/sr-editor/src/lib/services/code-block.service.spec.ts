import { TestBed } from '@angular/core/testing';

import { CodeBlockService } from './code-block.service';

describe('CodeBlockService', () => {
  let service: CodeBlockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeBlockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
