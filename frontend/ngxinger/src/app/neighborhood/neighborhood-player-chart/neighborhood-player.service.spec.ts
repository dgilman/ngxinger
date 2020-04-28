import { TestBed } from '@angular/core/testing';

import { NeighborhoodPlayerService } from './neighborhood-player.service';

describe('NeighborhoodPlayerService', () => {
  let service: NeighborhoodPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeighborhoodPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
