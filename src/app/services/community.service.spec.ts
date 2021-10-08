import { TestBed } from '@angular/core/testing';

import { ComunityService } from './community.service';

describe('ComunityService', () => {
  let service: ComunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComunityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
