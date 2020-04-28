import { TestBed } from '@angular/core/testing';

import { NeighborhoodHourlyService } from './neighborhood-hourly.service';

describe('NeighborhoodHourlyService', () => {
  let service: NeighborhoodHourlyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeighborhoodHourlyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
