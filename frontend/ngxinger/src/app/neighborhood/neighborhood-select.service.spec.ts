import { TestBed } from '@angular/core/testing';

import { NeighborhoodSelectService } from './neighborhood-select.service';

describe('NeighborhoodSelectService', () => {
  let service: NeighborhoodSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeighborhoodSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
