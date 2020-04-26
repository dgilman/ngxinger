import { TestBed } from '@angular/core/testing';

import { MostwantedMapService } from './mostwanted-map.service';

describe('MostwantedMapService', () => {
  let service: MostwantedMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MostwantedMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
