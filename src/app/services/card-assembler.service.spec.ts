import { TestBed } from '@angular/core/testing';

import { CardAssemblerService } from './card-assembler.service';

describe('CardAssemblerService', () => {
  let service: CardAssemblerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardAssemblerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
