import { TestBed } from '@angular/core/testing';

import { ActiveProfileService } from './active-profile.service';

describe('ActiveProfileService', () => {
  let service: ActiveProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
