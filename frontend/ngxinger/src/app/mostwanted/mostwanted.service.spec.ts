import { TestBed } from '@angular/core/testing';

import { MostWantedService } from './mostwanted.service';

describe('MostWantedService', () => {
  let service: MostWantedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MostWantedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
