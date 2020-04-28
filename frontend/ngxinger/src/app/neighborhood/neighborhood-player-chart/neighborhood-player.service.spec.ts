import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NeighborhoodPlayerService } from './neighborhood-player.service';

describe('NeighborhoodPlayerService', () => {
  let service: NeighborhoodPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(NeighborhoodPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
