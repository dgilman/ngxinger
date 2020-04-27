import { TestBed } from '@angular/core/testing';

import { MostWantedMapUpdateService } from './mostwanted-map-update.service';

describe('MostWantedMapUpdateService', () => {
  let service: MostWantedMapUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MostWantedMapUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
