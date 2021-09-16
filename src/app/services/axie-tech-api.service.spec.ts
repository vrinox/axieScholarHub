import { TestBed } from '@angular/core/testing';

import { AxieTechApiService } from './axie-tech-api.service';

describe('AxieTechApiService', () => {
  let service: AxieTechApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AxieTechApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
