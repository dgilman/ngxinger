import { TestBed } from '@angular/core/testing';

import { MapGeometryService } from './map-geometry.service';

describe('MapGeometryService', () => {
  let service: MapGeometryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapGeometryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
