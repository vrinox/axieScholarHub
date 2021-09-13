import { TestBed } from '@angular/core/testing';

import { AxieApiService } from './axie-api.service';

describe('AxieApiService', () => {
  let service: AxieApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AxieApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
