import { TestBed } from '@angular/core/testing';

import { TargetService } from './target.service';

describe('TargetService', () => {
  let service: TargetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TargetService],
    });
    service = TestBed.inject(TargetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
